import { HttpStatusCode } from './http-status-code';

export class HttpError extends Error {
  constructor(
    public readonly status: HttpStatusCode,
    message: string,
    public readonly data?: any
  ) {
    super(message);
  }
}
