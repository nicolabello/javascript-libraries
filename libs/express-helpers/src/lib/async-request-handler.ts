import { NextFunction, Request, Response } from 'express';

// Same defaults as Express' own RequestHandler, derived from `Request` so that no extra type packages are needed
type DefaultParams = Request['params'];
type DefaultQuery = Request['query'];

export interface AsyncRequestHandler<
  P = DefaultParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery = DefaultQuery,
  Locals extends Record<string, any> = Record<string, any>,
> {
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ): Promise<void>;
}

/**
 * Wraps an async route handler so that a rejected promise is forwarded to `next(error)`
 * and handled by the Express error-handling middleware.
 */
export function asyncRequestHandler<
  P = DefaultParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery = DefaultQuery,
  Locals extends Record<string, any> = Record<string, any>,
>(
  requestHandler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (req, res, next) => requestHandler(req, res, next).catch(next);
}
