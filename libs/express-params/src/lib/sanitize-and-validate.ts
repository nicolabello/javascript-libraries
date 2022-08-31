import { Request, RequestHandler } from 'express';
import { ValidationErrors } from './models/validation-errors';
import { Param } from './param';
import { deepValue, Typings } from '@nicolabello/js-helpers';
import { HttpError, HttpStatusCode } from '@nicolabello/express-http-error';

function getParam(req: Request, paramName: string, defaultValue?: any): any {
  for (const object of [req.params, req.body, req.query]) {
    const value = deepValue(object, paramName);
    if (Typings.isDefined(value)) {
      return value;
    }
  }
  return defaultValue;
}

export function sanitizeAndValidate(params: { [paramName: string]: Param }): RequestHandler {
  return (req, res, next): void => {
    const errors: { [paramName: string]: ValidationErrors } = {};

    Object.keys(params).forEach((paramName) => {
      const param = params[paramName];

      let value = getParam(req, param.name, param.defaultValue);

      // Apply sanitizers
      if (param.sanitizers?.length) {
        value = param.sanitizers.reduce((value: any, sanitizer) => sanitizer(value), value);
      }

      // Validate
      if (param.validators?.length) {
        const paramErrors = param.validators.reduce(
          (errors: ValidationErrors, validator) => ({
            ...errors,
            ...validator(value),
          }),
          {}
        );
        if (Object.keys(paramErrors).length) {
          errors[param.name] = paramErrors;
        }
      }

      req.params[paramName] = value;
    });

    if (Object.keys(errors).length) {
      throw new HttpError(HttpStatusCode.BadRequest, 'Bad Request', errors);
    }

    next();
  };
}
