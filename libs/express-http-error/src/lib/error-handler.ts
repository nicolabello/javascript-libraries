import { ErrorRequestHandler } from 'express';
import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

interface ErrorResponse {
  type: 'error';
  status: HttpStatusCode;
  message: string;
  data?: { [key: string]: any };
}

function getErrorResponse<T extends Error>(
  err: T,
  isProduction: boolean
): ErrorResponse {
  if (err instanceof HttpError) {
    return {
      type: 'error',
      status: err.status,
      message: err.message,
      ...(err.data ? { data: err.data } : null),
    };
  }

  return {
    type: 'error',
    status: HttpStatusCode.InternalServerError,
    message: 'Internal server error',
    ...(isProduction
      ? null
      : {
          message: err.message,
          data: {
            name: err.name,
            stack: err.stack,
          },
        }),
  };
}

function isNodeProduction(): boolean {
  return !!process.env.NODE_ENV?.match(/prod/gi);
}

export function errorHandler({
  isProduction = isNodeProduction(),
}: {
  isProduction?: boolean;
}): ErrorRequestHandler {
  return (err, req, res, next): ErrorRequestHandler => {
    const error = getErrorResponse(err, isProduction);
    res.status(error.status).send(error);
  };
}