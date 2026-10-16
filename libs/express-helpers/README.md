# @nicolabello/express-helpers

[![npm](https://img.shields.io/npm/v/@nicolabello/express-helpers.svg)](https://www.npmjs.com/package/@nicolabello/express-helpers)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Helpers for [Express](https://expressjs.com). Works with Express 4 and 5.

## Installation

```bash
npm install @nicolabello/express-helpers
```

## API

### `asyncRequestHandler(handler)`

Wraps an `async` route handler so that a rejected promise (or an error thrown inside it) is forwarded to `next(error)` and handled by your error-handling middleware.

In Express 4 an error thrown inside an `async` handler is not caught: the request hangs and an unhandled rejection is reported. Express 5 forwards rejected promises natively, but the wrapper is still useful for its typings and keeps the code portable between versions.

```ts
import express from 'express';

import { asyncRequestHandler } from '@nicolabello/express-helpers';
import { errorHandler } from '@nicolabello/express-http-error';

const app = express();

app.get(
  '/users/:id',
  asyncRequestHandler(async (req, res) => {
    const user = await db.findUser(req.params.id); // If this rejects, the error goes to errorHandler
    res.send(user);
  })
);

app.use(errorHandler());
```

The handler accepts the same generic parameters as Express' `RequestHandler` (route params, response body, request body, query and locals):

```ts
interface Params {
  id: string;
}

interface Body {
  name: string;
}

app.put(
  '/users/:id',
  express.json(),
  asyncRequestHandler<Params, User, Body>(async (req, res) => {
    // req.params.id: string, req.body.name: string, res.send() expects a User
    res.send(await db.updateUser(req.params.id, req.body.name));
  })
);
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
