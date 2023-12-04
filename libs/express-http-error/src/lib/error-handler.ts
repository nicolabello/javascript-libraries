import { ErrorRequestHandler } from 'express';

import { isNodeEnvProduction } from '@nicolabello/js-helpers';

import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

interface ErrorResponse {
  type: 'error';
  status: HttpStatusCode;
  message: string;
  data?: { [key: string]: any };
}

function getErrorResponse<T extends Error>(err: T, isProduction: boolean): ErrorResponse {
  if (err instanceof HttpError) {
    return {
      type: 'error',
      status: err.status,
      message: err.message,
      ...(err.data ? { data: err.data } : null),
      ...(!isProduction && err.debugData ? { debugData: err.debugData } : null),
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
          debugData: {
            name: err.name,
            stack: err.stack,
          },
        }),
  };
}

export function errorHandler({
  isProduction = isNodeEnvProduction(),
}: {
  isProduction?: boolean;
} = {}): ErrorRequestHandler {
  return (err, req, res, next) => {
    const error = getErrorResponse(err, isProduction);
    res.status(error.status).send(error);
  };
}
