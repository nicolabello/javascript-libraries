# @nicolabello/express-http-error

[![npm](https://img.shields.io/npm/v/@nicolabello/express-http-error.svg)](https://www.npmjs.com/package/@nicolabello/express-http-error)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

HTTP errors for [Express](https://expressjs.com): an `HttpError` class, an `HttpStatusCode` enum and an error-handling middleware that sends consistent JSON error responses, without leaking internal details in production.

Works with Express 4 and 5.

## Installation

```bash
npm install @nicolabello/express-http-error
```

## Usage

```ts
import express from 'express';

import { errorHandler, HttpError, HttpStatusCode } from '@nicolabello/express-http-error';

const app = express();

app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  if (!user) {
    throw new HttpError(HttpStatusCode.NotFound, 'User not found', { id: req.params.id });
  }
  res.send(user);
});

// Register the error handler after all the routes
app.use(errorHandler());
```

A request to `/users/42` for a missing user responds with status `404` and:

```json
{
  "type": "error",
  "status": 404,
  "message": "User not found",
  "data": { "id": "42" }
}
```

> With Express 4, errors thrown inside `async` handlers are not caught automatically: wrap the handlers with [`asyncRequestHandler`](https://www.npmjs.com/package/@nicolabello/express-helpers) or pass the error to `next(error)`. Express 5 handles rejected promises natively.

## API

### `HttpError`

```ts
new HttpError(status: HttpStatusCode, message: string, data?: any, debugData?: any)
```

| Property    | Description                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| `status`    | HTTP status code of the response                                                   |
| `message`   | Error message, always sent to the client                                           |
| `data`      | Optional details sent to the client (e.g. validation errors)                       |
| `debugData` | Optional details sent to the client **only outside production** (e.g. a SQL query) |

### `HttpStatusCode`

An enum of the standard HTTP status codes, with documentation for each one:

```ts
HttpStatusCode.Ok; // 200
HttpStatusCode.BadRequest; // 400
HttpStatusCode.Unauthorized; // 401
HttpStatusCode.Forbidden; // 403
HttpStatusCode.NotFound; // 404
HttpStatusCode.UnprocessableEntity; // 422
HttpStatusCode.InternalServerError; // 500
// ...
```

### `errorHandler(options?)`

Creates an Express error-handling middleware.

| Option         | Default                                | Description                                    |
| -------------- | -------------------------------------- | ---------------------------------------------- |
| `isProduction` | `true` when `NODE_ENV` contains `prod` | Hides `debugData` and unexpected error details |

How errors are converted to responses:

| Error           | Production                                       | Development                                                             |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `HttpError`     | `status`, `message` and `data`                   | `status`, `message`, `data` and `debugData`                             |
| Any other error | `500` with the message `"Internal server error"` | `500` with the error message, and its `name` and `stack` in `debugData` |

If the response headers have already been sent, the error is passed on to Express' default handler, which closes the connection.

### `getErrorResponse(error, isProduction)`

Converts an error to the response body used by `errorHandler`, so you can build your own handler (e.g. to add logging):

```ts
import { ErrorRequestHandler } from 'express';

import { getErrorResponse } from '@nicolabello/express-http-error';

const loggingErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response = getErrorResponse(err, process.env.NODE_ENV === 'production');
  if (response.status >= 500) {
    console.error(err);
  }
  res.status(response.status).send(response);
};
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
