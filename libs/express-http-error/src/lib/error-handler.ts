import { ErrorRequestHandler } from 'express';

import { isNodeEnvProduction } from '@nicolabello/js-helpers';

import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

export interface ErrorResponse {
  type: 'error';
  status: HttpStatusCode;
  message: string;
  data?: { [key: string]: any };
  debugData?: { [key: string]: any };
}

export function getErrorResponse(err: unknown, isProduction: boolean): ErrorResponse {
  if (err instanceof HttpError) {
    return {
      type: 'error',
      status: err.status,
      message: err.message,
      ...(err.data ? { data: err.data } : null),
      ...(!isProduction && err.debugData ? { debugData: err.debugData } : null),
    };
  }

  const error = err instanceof Error ? err : new Error(String(err));

  return {
    type: 'error',
    status: HttpStatusCode.InternalServerError,
    message: 'Internal server error',
    ...(isProduction
      ? null
      : {
          message: error.message,
          debugData: {
            name: error.name,
            stack: error.stack,
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
    // If the response has already started, let Express close the connection
    if (res.headersSent) {
      return next(err);
    }
    const error = getErrorResponse(err, isProduction);
    res.status(error.status).send(error);
  };
}
