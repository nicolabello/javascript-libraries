#!/usr/bin/env node
/**
 * Verifies that the built packages in dist/libs work when installed from npm.
 *
 * Every package is packed with `npm pack` and installed in a fresh temporary project,
 * exactly like a consumer would (only the declared dependencies and peer dependencies are available).
 * Then, for each package:
 *  - Node packages are loaded with both `require()` and `import` and smoke tested, and their ESM build is evaluated
 *  - Node packages are type checked from CommonJS, ESM and bundled TypeScript consumers
 *  - Angular packages are processed by the Angular linker (as the Angular CLI does) and loaded in JIT mode
 *
 * Usage: node tools/verify-packages.mjs  (after `nx run-many -t build`)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist/libs');
const workspaceRequire = createRequire(join(root, 'package.json'));

const packages = readdirSync(dist)
  .map((dir) => ({ dir: join(dist, dir), pkg: JSON.parse(readFileSync(join(dist, dir, 'package.json'), 'utf8')) }))
  .filter(({ pkg }) => !pkg.private);

const angularVersion = workspaceRequire('@angular/core/package.json').version.split('.')[0];

const nodePackages = packages.filter(({ pkg }) => !pkg.peerDependencies?.['@angular/core']);
const angularPackages = packages.filter(({ pkg }) => pkg.peerDependencies?.['@angular/core']);

function run(command, args, cwd) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function step(title, fn) {
  process.stdout.write(`- ${title} ... `);
  try {
    fn();
    console.log('ok');
  } catch (error) {
    console.log('FAILED');
    console.error(error.stderr || error.stdout || error);
    process.exitCode = 1;
  }
}

const temp = mkdtempSync(join(tmpdir(), 'verify-packages-'));
console.log(`Verifying ${packages.length} packages in ${temp}\n`);

try {
  // 1. Pack and install
  const tarballs = join(temp, 'tarballs');
  // Node and Angular packages are installed in separate projects so that dependencies of one group
  // (e.g. tslib, required by Angular) cannot hide a missing dependency in the other
  const app = join(temp, 'node-app');
  const ngApp = join(temp, 'angular-app');
  mkdirSync(tarballs);

  const tarballOf = {};
  for (const { dir, pkg } of packages) {
    if (!existsSync(join(dir, 'README.md')) || !existsSync(join(dir, 'LICENSE'))) {
      console.error(`${pkg.name}: README.md and LICENSE must be included in the package`);
      process.exitCode = 1;
    }
    const file = run('npm', ['pack', dir, '--pack-destination', tarballs, '--silent'], root).trim().split('\n').pop();
    tarballOf[pkg.name] = join(tarballs, file);
  }

  // Unpublished versions of internal dependencies must come from the local tarballs too
  const withInternalDependencies = (list) => {
    const names = new Set(list.map(({ pkg }) => pkg.name));
    for (const name of names) {
      const pkg = packages.find((p) => p.pkg.name === name).pkg;
      Object.keys(pkg.dependencies || {})
        .filter((dep) => tarballOf[dep])
        .forEach((dep) => names.add(dep));
    }
    return [...names].map((name) => tarballOf[name]);
  };

  const install = (dir, deps) => {
    mkdirSync(dir);
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app', private: true }, null, 2));
    run('npm', ['install', '--no-audit', '--no-fund', '--install-strategy=nested', ...deps], dir);
  };

  step('install Node packages (with their peer dependencies)', () =>
    install(app, [...withInternalDependencies(nodePackages), 'typescript', '@types/express'])
  );
  step('install Angular packages (with their peer dependencies)', () =>
    install(ngApp, [
      ...withInternalDependencies(angularPackages),
      `@angular/compiler@${angularVersion}`,
      'material-components-web@14',
    ])
  );

  // 2. Node packages: require + import + smoke tests
  const smokeTests = `
    const assert = require('node:assert');
    const { Acl } = require('@nicolabello/js-acl');
    const acl = new Acl();
    acl.addRole('user');
    acl.addRole('admin', 'user');
    acl.addResource('articles');
    acl.allow('user', 'articles', 'read');
    assert.equal(acl.isAllowed('admin', 'articles', 'read'), true);
    assert.equal(acl.isAllowed('admin', 'articles', 'delete'), false);

    const { Base64, deepValue } = require('@nicolabello/js-helpers');
    assert.deepEqual(Base64.decode(Base64.encode({ a: '你好' })), { a: '你好' });
    assert.equal(deepValue({ a: [{ b: 1 }] }, 'a[0].b'), 1);

    const { HttpError, HttpStatusCode, errorHandler } = require('@nicolabello/express-http-error');
    assert.equal(new HttpError(HttpStatusCode.NotFound, 'x').status, 404);
    assert.equal(typeof errorHandler(), 'function');

    const { asyncRequestHandler } = require('@nicolabello/express-helpers');
    assert.equal(typeof asyncRequestHandler(async () => undefined), 'function');

    const { sanitizeAndValidate, Param, Validators } = require('@nicolabello/express-params');
    assert.equal(typeof sanitizeAndValidate({ id: new Param('id', null, [], [Validators.required]) }), 'function');

    const { mySql, MySqlConnection } = require('@nicolabello/express-mysql');
    assert.equal(mySql.isConnected, false);
    assert.equal(MySqlConnection.escape('a'), "'a'");
  `;
  step('Node packages: require() and smoke tests', () => {
    writeFileSync(join(app, 'smoke.cjs'), smokeTests);
    run('node', ['smoke.cjs'], app);
  });

  for (const { pkg } of nodePackages) {
    step(`${pkg.name}: require() and import`, () => {
      const exportsCount = `Object.keys(m).filter((k) => k !== 'default').length`;
      writeFileSync(
        join(app, 'load.mjs'),
        `import { createRequire } from 'node:module';
         import * as m from '${pkg.name}';
         const cjs = createRequire(import.meta.url)('${pkg.name}');
         if (!${exportsCount}) throw new Error('No named ESM exports');
         if (!Object.keys(cjs).length) throw new Error('No CommonJS exports');`
      );
      run('node', ['load.mjs'], app);
    });

    // The ESM build, used by bundlers through the "module" condition
    step(`${pkg.name}: ESM build`, () => {
      const installed = join(app, 'node_modules', pkg.name);
      const esm = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8')).module;
      if (!esm) throw new Error('No "module" entry');
      // Evaluated from the package directory, so that its imports resolve as they would for a bundler
      execFileSync('node', ['--input-type=module'], {
        cwd: installed,
        input: readFileSync(join(installed, esm), 'utf8'),
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    });
  }

  // 3. Node packages: type check from a TypeScript consumer
  const consumer = `import express from 'express';
       import { Acl } from '@nicolabello/js-acl';
       import { Base64, Typings } from '@nicolabello/js-helpers';
       import { errorHandler, HttpError, HttpStatusCode } from '@nicolabello/express-http-error';
       import { asyncRequestHandler } from '@nicolabello/express-helpers';
       import { Param, sanitizeAndValidate, Sanitizers, Validators } from '@nicolabello/express-params';
       import { mySql, MySqlConnection } from '@nicolabello/express-mysql';

       enum Role { User, Admin }
       const acl = new Acl<Role, string, string>();
       acl.addRole(Role.User);
       const allowed: boolean = acl.isAllowed(Role.User, null);

       const encoded: string = Base64.encode({ a: 1 });
       const isString: boolean = Typings.isString(encoded);

       const app = express();
       app.get(
         '/users/:id',
         sanitizeAndValidate({ id: new Param('id', null, [Sanitizers.toString], [Validators.required]) }),
         asyncRequestHandler<{ id: string }>(async (req, res) => {
           if (!mySql.isConnected) throw new HttpError(HttpStatusCode.ServiceUnavailable, 'No database');
           const rows = await MySqlConnection.of(res).query<{ id: number }[]>('SELECT 1');
           res.send({ id: req.params.id, rows, allowed, isString });
         })
       );
       app.use(errorHandler());
      `;
  const typeCheck = (title, file, options) =>
    step(`Node packages: type check from ${title}`, () => {
      writeFileSync(join(app, file), consumer);
      run('npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', ...options, file], app);
    });
  typeCheck('a CommonJS consumer (nodenext)', 'consumer.cts', ['--module', 'nodenext', '--esModuleInterop']);
  typeCheck('an ESM consumer (nodenext)', 'consumer.mts', ['--module', 'nodenext']);
  typeCheck('a bundled consumer (bundler)', 'consumer.ts', ['--module', 'preserve', '--moduleResolution', 'bundler']);

  // 4. Angular packages: link (as the Angular CLI does) and load in JIT mode
  // Use the Babel version the Angular compiler is built for
  const babel = createRequire(workspaceRequire.resolve('@angular/compiler-cli/package.json'))('@babel/core');
  const linkerPlugin = workspaceRequire('@angular/compiler-cli/linker/babel').default;
  for (const { pkg } of angularPackages) {
    const installed = join(ngApp, 'node_modules', pkg.name);
    const fesm = join(installed, JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8')).module);

    step(`${pkg.name}: Angular linker`, () => {
      const result = babel.transformSync(readFileSync(fesm, 'utf8'), {
        filename: fesm,
        plugins: [linkerPlugin],
        babelrc: false,
        configFile: false,
      });
      if (/ɵɵngDeclare/.test(result.code)) throw new Error('Some partial declarations were not linked');
    });

    step(`${pkg.name}: import (all dependencies resolvable)`, () => {
      writeFileSync(
        join(ngApp, 'load.mjs'),
        `import '@angular/compiler';\nimport * as m from '${pkg.name}';\nif (!Object.keys(m).length) throw new Error('No exports');`
      );
      run('node', ['load.mjs'], ngApp);
    });
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(process.exitCode ? '\nPackage verification FAILED' : '\nAll packages verified');
