import { createPool, Pool, PoolConnection } from 'mysql2';

export class MySql {
  private static pool: Pool;

  public static async connect({
    connectionLimit = 10,
    host,
    user,
    password,
    database,
  }: {
    connectionLimit?: number;
    host: string;
    user: string;
    password: string;
    database: string;
  }): Promise<void> {
    if (this.pool) {
      return Promise.resolve();
    }
    this.pool = createPool({
      connectionLimit,
      host,
      user,
      password,
      database,
    });
    await this.checkConnection();
  }

  private static checkConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) reject(error);
        connection?.release();
        resolve();
      });
    });
  }

  // public static async query<T = any>(sql: string): Promise<T> {
  //   return new Promise((resolve, reject) => {
  //     this.pool.query(sql, (error, result: T) => {
  //       if (error) reject(error);
  //       resolve(result);
  //     });
  //   });
  // }

  public static getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) reject(error);
        resolve(connection);
      });
    });
  }

  // public static disconnect(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.pool.end((error) => {
  //       if (error) reject(error);
  //       resolve();
  //     });
  //   });
  // }
}
