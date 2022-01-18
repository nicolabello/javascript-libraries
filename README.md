# JavascriptLibraries

This project was generated using [Nx](https://nx.dev).

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `yarn add --dev @nrwl/react`
- Web (no framework frontends)
  - `yarn add --dev @nrwl/web`
- [Angular](https://angular.io)
  - `yarn add --dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `yarn add --dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `yarn add --dev @nrwl/express`
- [Node](https://nodejs.org)
  - `yarn add --dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

Run `nx g @nrwl/node:library my-lib --publishable true --importPath @my-org/my-lib` to generate a publishable node library.

Run `nx g @nrwl/angular:library my-lib --publishable true --importPath @my-org/my-lib` to generate a publishable angular library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@javascript-libraries/mylib`.

Publishable libraries' documentation can be found [here](https://nx.dev/l/a/structure/buildable-and-publishable-libraries).

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Husky hooks

Visit the [Husky Documentation](https://typicode.github.io/husky/#/?id=automatic-recommended) to learn more.
Supported Git hooks' list [here](https://git-scm.com/docs/githooks).

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

Visit [Nx Cloud](https://nx.app/) to learn more.
