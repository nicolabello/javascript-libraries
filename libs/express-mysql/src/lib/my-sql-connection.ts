import { Response } from 'express';
import { escape, PoolConnection } from 'mysql2';
import { MySql } from './my-sql';

export class MySqlConnection {
  private connection?: PoolConnection;

  public static of(res: Response): MySqlConnection {
    let connection: MySqlConnection = res.locals.mySqlConnection;

    if (!connection) {
      connection = new MySqlConnection();
      res.locals.mySqlConnection = connection;
      res.once('finish', () => connection.release());
    }

    return connection;
  }

  public static escape(value: any): string {
    return escape(value);
  }

  public release(): void {
    this.connection?.release();
  }

  public async query<T = any>(sql: string, useNewConnection?: boolean): Promise<T> {
    await this.initConnection(useNewConnection);
    if (this.connection) {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, (error, result: T) => {
          if (error) reject(error);
          resolve(result);
        });
      });
    }
    return Promise.reject();
  }

  private async initConnection(useNewConnection?: boolean): Promise<void> {
    if (!this.connection) {
      this.connection = await MySql.getConnection();
    } else if (useNewConnection) {
      this.release();
      this.connection = await MySql.getConnection();
    }
  }
}
