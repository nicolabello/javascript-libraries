import { HttpError } from '@nicolabello/express-http-error';

import { Param } from './param';
import { sanitizeAndValidate } from './sanitize-and-validate';
import { Sanitizers } from './sanitizers';
import { Validators } from './validators';

function run(params: { [name: string]: Param }, req: any): { req: any; next: jest.Mock } {
  const next = jest.fn();
  sanitizeAndValidate(params)(req, {} as any, next);
  return { req, next };
}

describe('Sanitizers', () => {
  it('converts values', () => {
    expect(Sanitizers.toString(null)).toBe('');
    expect(Sanitizers.toString(1)).toBe('1');
    expect(Sanitizers.toBoolean(' TRUE ')).toBe(true);
    expect(Sanitizers.toBoolean('yes')).toBe(false);
    expect(Sanitizers.toBoolean(true)).toBe(true);
  });
});

describe('Validators', () => {
  it('validates required values', () => {
    expect(Validators.required('')).toEqual({ required: true });
    expect(Validators.required(undefined)).toEqual({ required: true });
    expect(Validators.required(0)).toBeNull();
    expect(Validators.required('a')).toBeNull();
  });
});

describe('sanitizeAndValidate', () => {
  it('reads params from params, body and query (in this order) and stores them in req.params', () => {
    const { req, next } = run(
      {
        id: new Param('id'),
        name: new Param('user.name', null, [Sanitizers.toString]),
        active: new Param('active', false, [Sanitizers.toBoolean]),
        page: new Param('page', 1),
      },
      { params: { id: '1' }, body: { user: { name: 'John' } }, query: { active: 'true' } }
    );
    expect(next).toHaveBeenCalledWith();
    expect(req.params).toEqual({ id: '1', name: 'John', active: true, page: 1 });
  });

  it('throws a 400 HttpError with the validation errors', () => {
    expect.assertions(3);
    try {
      run({ email: new Param('email', undefined, [Sanitizers.toString], [Validators.required]) }, { params: {} });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(400);
      expect((error as HttpError).data).toEqual({ email: { required: true } });
    }
  });
});
