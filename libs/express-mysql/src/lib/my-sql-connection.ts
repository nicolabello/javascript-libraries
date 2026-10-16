import { Response } from 'express';

import { escape, PoolConnection } from 'mysql2';

import { HttpError, HttpStatusCode } from '@nicolabello/express-http-error';

import { mySql } from './my-sql';

export class MySqlConnection {
  private connection?: PoolConnection;

  public static of(res: Response): MySqlConnection {
    let connection: MySqlConnection = res.locals['mySqlConnection'];

    if (!connection) {
      connection = new MySqlConnection();
      res.locals['mySqlConnection'] = connection;
      res.once('finish', () => connection.release());
      res.once('close', () => connection.release());
    }

    return connection;
  }

  public static escape(value: Parameters<typeof escape>[0]): string {
    return escape(value);
  }

  public release(): void {
    this.connection?.release();
    this.connection = undefined;
  }

  public async query<T = any>(sql: string, useNewConnection?: boolean): Promise<T> {
    const connection = await this.initConnection(useNewConnection);

    return new Promise<T>((resolve, reject) => {
      connection.query(sql, (error, result) => {
        if (error) {
          return reject(
            new HttpError(HttpStatusCode.InternalServerError, error.message, null, {
              query: sql,
            })
          );
        }
        resolve(result as T);
      });
    });
  }

  private async initConnection(useNewConnection?: boolean): Promise<PoolConnection> {
    if (this.connection && useNewConnection) {
      this.release();
    }

    if (!this.connection) {
      this.connection = await mySql.getConnection();
    }

    return this.connection;
  }
}
