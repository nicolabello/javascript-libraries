# @nicolabello/express-params

[![npm](https://img.shields.io/npm/v/@nicolabello/express-params.svg)](https://www.npmjs.com/package/@nicolabello/express-params)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Declarative request parameter sanitization and validation middleware for [Express](https://expressjs.com). Works with Express 4 and 5.

- Reads each parameter from the route params, the body or the query string, with deep paths (e.g. `user.address.city`)
- Applies default values and sanitizers (e.g. convert to string or boolean)
- Runs validators and responds `400 Bad Request` with all the validation errors
- Stores the clean values in `req.params`

## Installation

```bash
npm install @nicolabello/express-params @nicolabello/express-http-error
```

## Usage

```ts
import express from 'express';

import { errorHandler } from '@nicolabello/express-http-error';
import { Param, sanitizeAndValidate, Sanitizers, Validators } from '@nicolabello/express-params';

const app = express();

app.use(express.json()); // Needed to read parameters from the request body

app.post(
  '/users/:groupId',
  sanitizeAndValidate({
    groupId: new Param('groupId', null, [Sanitizers.toString], [Validators.required]),
    email: new Param('user.email', null, [Sanitizers.toString], [Validators.required]),
    newsletter: new Param('newsletter', false, [Sanitizers.toBoolean]),
  }),
  (req, res) => {
    const { groupId, email, newsletter } = req.params;
    // ...
  }
);

app.use(errorHandler());
```

If validation fails, the middleware throws an [`HttpError`](https://www.npmjs.com/package/@nicolabello/express-http-error) and the error handler responds with status `400`:

```json
{
  "type": "error",
  "status": 400,
  "message": "Bad Request",
  "data": {
    "user.email": { "required": true }
  }
}
```

## API

### `sanitizeAndValidate(params)`

Creates a middleware from an object of `Param`s. For each entry:

1. The value is read from `req.params`, then `req.body`, then `req.query`: the first one that is not `undefined` is used. If none is found, the default value is used.
2. The sanitizers are applied in order, each receiving the result of the previous one.
3. The validators are run on the sanitized value, and their errors are merged.
4. The value is stored in `req.params` under the **key of the entry** (not the parameter name).

If any parameter has validation errors, an `HttpError` with status `400` is thrown. Its `data` contains the errors, keyed by parameter name.

### `new Param(name, defaultValue?, sanitizers?, validators?)`

| Argument       | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `name`         | Name of the parameter, or a deep path with dot/bracket notation (e.g. `items[0].id`) |
| `defaultValue` | Value used when the parameter is not in the request                                  |
| `sanitizers`   | Array of functions `(value: any) => any`                                             |
| `validators`   | Array of functions `(value: any) => ValidationErrors \| null`                        |

### Built-in sanitizers

| Sanitizer              | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `Sanitizers.toString`  | Converts to string, `null` and `undefined` become `''`                     |
| `Sanitizers.toBoolean` | `true` for `true` and the string `'true'` (case-insensitive), else `false` |

### Built-in validators

| Validator             | Error                | Description                                                                |
| --------------------- | -------------------- | -------------------------------------------------------------------------- |
| `Validators.required` | `{ required: true }` | Fails for falsy values (`''`, `null`, `undefined`, `false`...), except `0` |

### Custom sanitizers and validators

```ts
import { Sanitizer, Validator } from '@nicolabello/express-params';

const toInteger: Sanitizer<number> = (value) => parseInt(value, 10);

const min =
  (min: number): Validator =>
  (value) =>
    value >= min ? null : { min: { min, actual: value } };

sanitizeAndValidate({
  page: new Param('page', 1, [toInteger], [min(1)]),
});
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
