import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2';

class MySql {
  private pool?: Pool;

  public get isConnected(): boolean {
    return !!this.pool;
  }

  public async connect(config: PoolOptions): Promise<void> {
    if (this.pool) {
      return;
    }

    const pool = createPool(config);

    try {
      await MySql.checkConnection(pool);
    } catch (error) {
      pool.end();
      throw error;
    }

    this.pool = pool;
  }

  public getConnection(): Promise<PoolConnection> {
    const pool = this.pool;

    if (!pool) {
      return Promise.reject(new Error('MySQL pool is not initialised: call mySql.connect(config) first'));
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => (error ? reject(error) : resolve(connection)));
    });
  }

  public disconnect(): Promise<void> {
    const pool = this.pool;
    this.pool = undefined;

    if (!pool) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => pool.end((error) => (error ? reject(error) : resolve())));
  }

  private static checkConnection(pool: Pool): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) {
          return reject(error);
        }
        connection.release();
        resolve();
      });
    });
  }
}

// Singleton
export const mySql = new MySql();
