import { createPool, Pool, PoolConnection } from 'mysql2';

class MySql {
  private pool: Pool;

  public async connect({
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

  public getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) reject(error);
        resolve(connection);
      });
    });
  }

  // public async query<T = any>(sql: string): Promise<T> {
  //   return new Promise((resolve, reject) => {
  //     this.pool.query(sql, (error, result: T) => {
  //       if (error) reject(error);
  //       resolve(result);
  //     });
  //   });
  // }

  private checkConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) reject(error);
        connection?.release();
        resolve();
      });
    });
  }

  // public disconnect(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.pool.end((error) => {
  //       if (error) reject(error);
  //       resolve();
  //     });
  //   });
  // }
}

// Singleton
export const mySql = new MySql();
