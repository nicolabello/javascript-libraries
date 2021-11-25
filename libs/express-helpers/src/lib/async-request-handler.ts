import { NextFunction, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

export interface AsyncRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> {
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ): Promise<void>;
}

export function asyncRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
>(
  requestHandler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (req, res, next) => requestHandler(req, res, next).catch(next);
}
