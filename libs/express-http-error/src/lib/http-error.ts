import { HttpStatusCode } from './http-status-code';

export class HttpError extends Error {
  public constructor(
    public readonly status: HttpStatusCode,
    message: string,
    public readonly data?: any,
    public readonly debugData?: any
  ) {
    super(message);
  }
}
