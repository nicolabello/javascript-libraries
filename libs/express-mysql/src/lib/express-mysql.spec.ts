import { EventEmitter } from 'events';
import { createPool } from 'mysql2';

import { HttpError } from '@nicolabello/express-http-error';

import { mySql } from './my-sql';
import { MySqlConnection } from './my-sql-connection';

jest.mock('mysql2', () => ({
  ...jest.requireActual('mysql2'),
  createPool: jest.fn(),
}));

function mockPool(query: (sql: string, cb: (error: any, result?: any) => void) => void): any {
  const connection = { query: jest.fn(query), release: jest.fn() };
  const pool = {
    connection,
    getConnection: jest.fn((cb) => cb(null, connection)),
    end: jest.fn((cb?: (error: any) => void) => cb?.(null)),
  };
  (createPool as jest.Mock).mockReturnValue(pool);
  return pool;
}

describe('express-mysql', () => {
  afterEach(() => mySql.disconnect());

  it('rejects with a clear error when not connected', async () => {
    await expect(mySql.getConnection()).rejects.toThrow('call mySql.connect(config) first');
  });

  it('closes the pool if the first connection fails', async () => {
    const pool = mockPool(() => null);
    pool.getConnection.mockImplementation((cb: any) => cb(new Error('ECONNREFUSED')));
    await expect(mySql.connect({})).rejects.toThrow('ECONNREFUSED');
    expect(pool.end).toHaveBeenCalled();
    expect(mySql.isConnected).toBe(false);
  });

  it('runs queries on one connection per response and releases it when the response finishes', async () => {
    const pool = mockPool((sql, cb) => cb(null, [{ id: 1 }]));
    await mySql.connect({});

    const res: any = Object.assign(new EventEmitter(), { locals: {} });
    const connection = MySqlConnection.of(res);
    expect(MySqlConnection.of(res)).toBe(connection);

    await expect(connection.query('SELECT 1')).resolves.toEqual([{ id: 1 }]);
    await connection.query('SELECT 2');
    // 1 call for the connection check + 1 for the request
    expect(pool.getConnection).toHaveBeenCalledTimes(2);

    res.emit('finish');
    expect(pool.connection.release).toHaveBeenCalledTimes(2);
  });

  it('rejects with an HttpError when the query fails', async () => {
    mockPool((sql, cb) => cb(new Error('syntax error')));
    await mySql.connect({});

    const error = await new MySqlConnection().query('SELEC 1').catch((e) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(500);
    expect(error.debugData).toEqual({ query: 'SELEC 1' });
  });

  it('escapes values', () => {
    expect(MySqlConnection.escape("O'Reilly")).toBe("'O\\'Reilly'");
  });
});
