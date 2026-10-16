# @nicolabello/express-mysql

[![npm](https://img.shields.io/npm/v/@nicolabello/express-mysql.svg)](https://www.npmjs.com/package/@nicolabello/express-mysql)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

MySQL helpers for [Express](https://expressjs.com), built on [mysql2](https://github.com/sidorares/node-mysql2):

- A shared connection pool
- One pooled connection per request, released automatically when the response is finished or closed
- Query errors converted to [`HttpError`](https://www.npmjs.com/package/@nicolabello/express-http-error)s, with the failing query visible only outside production

Works with Express 4 and 5.

## Installation

```bash
npm install @nicolabello/express-mysql mysql2
```

## Usage

```ts
import express from 'express';

import { asyncRequestHandler } from '@nicolabello/express-helpers';
import { errorHandler } from '@nicolabello/express-http-error';
import { mySql, MySqlConnection } from '@nicolabello/express-mysql';

// Create the pool and check that a connection can be established
await mySql.connect({
  host: 'localhost',
  user: 'app',
  password: process.env.DB_PASSWORD,
  database: 'app',
  connectionLimit: 10,
});

const app = express();

app.get(
  '/users/:id',
  asyncRequestHandler(async (req, res) => {
    const db = MySqlConnection.of(res);
    const id = MySqlConnection.escape(req.params.id);

    const users = await db.query<{ id: number; name: string }[]>(`SELECT id, name FROM users WHERE id = ${id}`);
    res.send(users[0]);
  })
);

app.use(errorHandler());
app.listen(3000);
```

> ⚠️ `query()` runs the SQL string as is. Always escape values coming from the request with `MySqlConnection.escape()` to prevent SQL injection.

## API

### `mySql`

The shared pool (a singleton).

| Member             | Description                                                                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connect(options)` | Creates the pool with the given [mysql2 pool options](https://sidorares.github.io/node-mysql2/docs) and checks that a connection works. Rejects (and closes the pool) if it does not. Calling it again once connected does nothing. |
| `getConnection()`  | Gets a connection from the pool. Release it with `connection.release()` when done.                                                                                                                                                  |
| `disconnect()`     | Closes the pool.                                                                                                                                                                                                                    |
| `isConnected`      | `true` once `connect()` has succeeded.                                                                                                                                                                                              |

### `MySqlConnection`

| Member                             | Description                                                                                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MySqlConnection.of(res)`          | Returns the connection for the current request, creating it on first use. Repeated calls during the same request return the same connection, so you can use transactions. The pooled connection is released when the response is finished or closed. |
| `MySqlConnection.escape(value)`    | Escapes a value for use in a SQL string (see [mysql2 escaping](https://sidorares.github.io/node-mysql2/docs)).                                                                                                                                       |
| `query<T>(sql, useNewConnection?)` | Runs a query and resolves with its result. If `useNewConnection` is `true`, the current connection is released and a new one is used. Rejects with an `HttpError` (`500`) whose `debugData` contains the query.                                      |
| `release()`                        | Releases the pooled connection (done automatically by `of(res)`).                                                                                                                                                                                    |

Transactions on the request connection:

```ts
const db = MySqlConnection.of(res);
await db.query('START TRANSACTION');
try {
  await db.query(`INSERT INTO orders (user_id) VALUES (${MySqlConnection.escape(userId)})`);
  await db.query(`UPDATE users SET orders = orders + 1 WHERE id = ${MySqlConnection.escape(userId)}`);
  await db.query('COMMIT');
} catch (error) {
  await db.query('ROLLBACK');
  throw error;
}
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
