import { errorHandler, getErrorResponse } from './error-handler';
import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

function mockResponse(headersSent = false): any {
  const res: any = { headersSent };
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  return res;
}

describe('HttpError', () => {
  it('is an Error with status and data', () => {
    const error = new HttpError(HttpStatusCode.NotFound, 'Not found', { id: 1 }, { query: 'x' });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.name).toBe('HttpError');
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ id: 1 });
    expect(error.debugData).toEqual({ query: 'x' });
  });
});

describe('getErrorResponse', () => {
  it('exposes HttpError details, hiding debug data in production', () => {
    const error = new HttpError(HttpStatusCode.BadRequest, 'Bad', { field: 'x' }, { secret: true });
    expect(getErrorResponse(error, false)).toEqual({
      type: 'error',
      status: 400,
      message: 'Bad',
      data: { field: 'x' },
      debugData: { secret: true },
    });
    expect(getErrorResponse(error, true)).toEqual({ type: 'error', status: 400, message: 'Bad', data: { field: 'x' } });
  });

  it('hides unexpected errors in production', () => {
    expect(getErrorResponse(new Error('boom'), true)).toEqual({
      type: 'error',
      status: 500,
      message: 'Internal server error',
    });
    expect(getErrorResponse(new Error('boom'), false)).toMatchObject({
      status: 500,
      message: 'boom',
      debugData: { name: 'Error' },
    });
  });

  it('handles non-Error values', () => {
    expect(getErrorResponse('boom', false)).toMatchObject({ status: 500, message: 'boom' });
  });
});

describe('errorHandler', () => {
  it('sends the error response', () => {
    const res = mockResponse();
    const next = jest.fn();
    errorHandler({ isProduction: true })(new HttpError(HttpStatusCode.Forbidden, 'Nope'), {} as any, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ type: 'error', status: 403, message: 'Nope' });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates to Express when headers were already sent', () => {
    const res = mockResponse(true);
    const next = jest.fn();
    const error = new Error('late');
    errorHandler()(error, {} as any, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.send).not.toHaveBeenCalled();
  });
});
