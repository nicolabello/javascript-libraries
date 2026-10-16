import { Base64 } from './base64';
import { deepValue } from './deep-value';
import { isNodeEnvProduction } from './is-node-env-production';
import { Regexp } from './regexp';
import { Typings } from './typings';

describe('Base64', () => {
  it('round-trips JSON values', () => {
    const value = { a: 1, b: ['x', true, null], c: { d: 'e' } };
    expect(Base64.decode(Base64.encode(value))).toEqual(value);
  });

  it('round-trips non-Latin-1 strings', () => {
    const value = { text: 'héllo wörld – 你好 👋' };
    expect(Base64.decode(Base64.encode(value))).toEqual(value);
  });

  it('decodes values encoded as Latin-1 by previous versions', () => {
    expect(Base64.decode(btoa(JSON.stringify('café')))).toBe('café');
  });

  it('returns null for invalid input', () => {
    expect(Base64.decode('not base64!')).toBeNull();
    expect(Base64.decode(btoa('{not json'))).toBeNull();
  });
});

describe('deepValue', () => {
  const object = { a: { b: [{ c: 1 }, { c: 2 }] }, d: 0 };

  it('reads nested properties with dot and bracket notation', () => {
    expect(deepValue(object, 'a.b[1].c')).toBe(2);
    expect(deepValue(object, 'a.b.0.c')).toBe(1);
    expect(deepValue(object, 'd')).toBe(0);
  });

  it('returns undefined for missing paths', () => {
    expect(deepValue(object, 'a.x.y')).toBeUndefined();
    expect(deepValue(undefined as any, 'a')).toBeUndefined();
  });
});

describe('isNodeEnvProduction', () => {
  const nodeEnv = process.env.NODE_ENV;
  afterEach(() => (process.env.NODE_ENV = nodeEnv));

  it('detects production', () => {
    process.env.NODE_ENV = 'production';
    expect(isNodeEnvProduction()).toBe(true);
    process.env.NODE_ENV = 'development';
    expect(isNodeEnvProduction()).toBe(false);
  });
});

describe('Regexp', () => {
  it('validates emails', () => {
    expect(Regexp.email.test('john.doe@example.com')).toBe(true);
    expect(Regexp.email.test('john.doe@example')).toBe(false);
  });

  it('removes extra spaces', () => {
    expect(Regexp.removeExtraSpaces('  a   b \n c ')).toBe('a b c');
  });

  it('escapes patterns', () => {
    expect(new RegExp(Regexp.escapePattern('a.b*c')).test('a.b*c')).toBe(true);
    expect(new RegExp(Regexp.escapePattern('a.b*c')).test('axbbc')).toBe(false);
  });

  it('matches any word', () => {
    const regExp = Regexp.getMatchAnyRegExp('foo bar baz');
    expect('a baz'.match(regExp)).toEqual(['baz']);
    expect('foo bar baz'.match(regExp)).toEqual(['foo', 'bar', 'baz']);
  });

  it('matches all words in order', () => {
    expect(Regexp.getMatchAllRegExp('foo baz').test('foo bar baz')).toBe(true);
    expect(Regexp.getMatchAllRegExp('baz foo').test('foo bar baz')).toBe(false);
  });

  it('matches the full string', () => {
    expect(Regexp.getFullMatchRegExp('Foo').test('foo')).toBe(true);
    expect(Regexp.getFullMatchRegExp('Foo').test('food')).toBe(false);
  });
});

describe('Typings', () => {
  it('detects types', () => {
    expect(Typings.isDefined(null)).toBe(true);
    expect(Typings.isDefined(undefined)).toBe(false);
    expect(Typings.isString('')).toBe(true);
    expect(Typings.isNumber(1)).toBe(true);
    expect(Typings.isNumber(NaN)).toBe(false);
    expect(Typings.isBoolean(false)).toBe(true);
    expect(Typings.isArray([])).toBe(true);
    expect(Typings.isFunction(() => null)).toBe(true);
  });

  it('detects plain objects and always returns a boolean', () => {
    expect(Typings.isObject({})).toBe(true);
    expect(Typings.isObject([])).toBe(false);
    expect(Typings.isObject(new Date())).toBe(false);
    expect(Typings.isObject(null)).toBe(false);
    expect(Typings.isObject(0)).toBe(false);
    expect(Typings.isObject('')).toBe(false);
  });

  it('converts to string', () => {
    expect(Typings.toString(null)).toBe('');
    expect(Typings.toString(undefined)).toBe('');
    expect(Typings.toString(0)).toBe('0');
  });
});
