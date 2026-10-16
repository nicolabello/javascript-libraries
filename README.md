# JavaScript Libraries

[![CI](https://github.com/nicolabello/javascript-libraries/actions/workflows/ci.yml/badge.svg)](https://github.com/nicolabello/javascript-libraries/actions/workflows/ci.yml)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)

A collection of small, focused TypeScript libraries for JavaScript, Node.js/Express and Angular, published on npm under the `@nicolabello` scope.

## Packages

### JavaScript (browser and Node.js)

| Package                                      | Description                                                                         | npm                                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [`@nicolabello/js-acl`](libs/js-acl)         | Lightweight, dependency-free access control list (roles, resources and privileges). | [![npm](https://img.shields.io/npm/v/@nicolabello/js-acl.svg)](https://www.npmjs.com/package/@nicolabello/js-acl)         |
| [`@nicolabello/js-helpers`](libs/js-helpers) | Type guards, deep property access, Unicode-safe Base64 JSON and RegExp helpers.     | [![npm](https://img.shields.io/npm/v/@nicolabello/js-helpers.svg)](https://www.npmjs.com/package/@nicolabello/js-helpers) |

### Express

| Package                                                      | Description                                                           | npm                                                                                                                                       |
| ------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [`@nicolabello/express-http-error`](libs/express-http-error) | `HttpError`, `HttpStatusCode` and a JSON error-handling middleware.   | [![npm](https://img.shields.io/npm/v/@nicolabello/express-http-error.svg)](https://www.npmjs.com/package/@nicolabello/express-http-error) |
| [`@nicolabello/express-helpers`](libs/express-helpers)       | Typed wrapper that forwards async route handler errors to `next()`.   | [![npm](https://img.shields.io/npm/v/@nicolabello/express-helpers.svg)](https://www.npmjs.com/package/@nicolabello/express-helpers)       |
| [`@nicolabello/express-params`](libs/express-params)         | Declarative request parameter sanitization and validation middleware. | [![npm](https://img.shields.io/npm/v/@nicolabello/express-params.svg)](https://www.npmjs.com/package/@nicolabello/express-params)         |
| [`@nicolabello/express-mysql`](libs/express-mysql)           | `mysql2` pool helpers with one connection per request.                | [![npm](https://img.shields.io/npm/v/@nicolabello/express-mysql.svg)](https://www.npmjs.com/package/@nicolabello/express-mysql)           |

### Angular

| Package                                                                      | Description                                                                         | npm                                                                                                                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@nicolabello/ng-helpers`](libs/ng-helpers)                                 | Base `ControlValueAccessor`, form utilities, `*nbSubscribe` and RxJS DOM observers. | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-helpers.svg)](https://www.npmjs.com/package/@nicolabello/ng-helpers)                                 |
| [`@nicolabello/ng-suspense`](libs/ng-suspense)                               | Declarative loading / error / empty / data states in templates.                     | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-suspense.svg)](https://www.npmjs.com/package/@nicolabello/ng-suspense)                               |
| [`@nicolabello/ng-router-history`](libs/ng-router-history)                   | Previous URL tracking and safe "back" navigation for the Angular Router.            | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-router-history.svg)](https://www.npmjs.com/package/@nicolabello/ng-router-history)                   |
| [`@nicolabello/ng-flex`](libs/ng-flex)                                       | Pixel-precise layouts of fixed and dynamic panes.                                   | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-flex.svg)](https://www.npmjs.com/package/@nicolabello/ng-flex)                                       |
| [`@nicolabello/ng-dynamic-router`](libs/ng-dynamic-router)                   | Mobile-style stacked navigation with animated transitions and subviews.             | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-dynamic-router.svg)](https://www.npmjs.com/package/@nicolabello/ng-dynamic-router)                   |
| [`@nicolabello/ng-material-components-web`](libs/ng-material-components-web) | Auto-initialising Angular directives for Material Components for the Web.           | [![npm](https://img.shields.io/npm/v/@nicolabello/ng-material-components-web.svg)](https://www.npmjs.com/package/@nicolabello/ng-material-components-web) |

The JavaScript and Express packages ship both ES modules and CommonJS, with TypeScript types. The Angular packages require **Angular 22**. Every package has its own README with installation and usage instructions.

## Development

This is an [Nx](https://nx.dev) monorepo. Each library lives in `libs/<name>` and is published from `dist/libs/<name>`.

### Prerequisites

- Node.js 24 (see [`.nvmrc`](.nvmrc), e.g. `nvm use`)
- [Yarn 1](https://classic.yarnpkg.com/)

```bash
yarn install
```

### Common tasks

```bash
yarn nx test js-acl                      # Test one library
yarn nx lint js-acl                      # Lint one library
yarn nx build js-acl                     # Build one library into dist/libs/js-acl

yarn nx run-many -t lint test build      # Lint, test and build everything
yarn verify-packages                     # Pack the built libraries and check they work when installed from npm
```

`verify-packages` packs every built library with `npm pack`, installs the tarballs in a clean project (with only their declared dependencies and peer dependencies) and then loads, smoke tests and type checks them. The Angular libraries are also processed by the Angular linker. Run it after a build.

Linting includes [`@nx/dependency-checks`](https://nx.dev/nx-api/eslint-plugin/documents/dependency-checks), which fails if a library's `package.json` does not declare a package its code imports.

### Releasing

Packages are published by the [CI workflow](.github/workflows/ci.yml) when changes are pushed to `master`:

1. Bump the `version` in `libs/<name>/package.json` (and the version range in any library that depends on it)
2. Open a pull request: lint, tests, builds and package verification run on it
3. Merge it: every package whose version is not on npm yet is published, with [npm provenance](https://docs.npmjs.com/generating-provenance-statements)

Publishing requires an `NPM_AUTH_TOKEN` repository secret.

## License

All packages are licensed under the [GNU General Public License v2.0 or later](LICENSE).
