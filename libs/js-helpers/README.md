# @nicolabello/js-helpers

[![npm](https://img.shields.io/npm/v/@nicolabello/js-helpers.svg)](https://www.npmjs.com/package/@nicolabello/js-helpers)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Small, dependency-free JavaScript/TypeScript helpers that work in the browser and in Node.js (ES modules and CommonJS).

## Installation

```bash
npm install @nicolabello/js-helpers
```

```ts
import { Base64, deepValue, isNodeEnvProduction, Regexp, Typings } from '@nicolabello/js-helpers';
```

## API

### `Base64`

Encodes any JSON-serialisable value to a Base64 string, and back. Strings are encoded as UTF-8, so any Unicode text is supported.

```ts
const encoded = Base64.encode({ id: 1, name: 'Zoë 👋' }); // "eyJpZCI6MSwibmFtZSI6..."
const decoded = Base64.decode<{ id: number; name: string }>(encoded); // { id: 1, name: 'Zoë 👋' }

Base64.decode('not valid'); // null
```

`decode()` returns `null` when the input is not valid Base64 or not valid JSON.

### `deepValue(object, path)`

Safely reads a nested property using dot and/or bracket notation. Returns `undefined` if any part of the path is missing.

```ts
const user = { address: { lines: ['10 Downing St', 'London'] } };

deepValue(user, 'address.lines[1]'); // 'London'
deepValue(user, 'address.lines.0'); // '10 Downing St'
deepValue(user, 'address.zip.code'); // undefined
```

### `isNodeEnvProduction()`

Returns `true` when `process.env.NODE_ENV` contains `prod` (case insensitive), e.g. `production`. Node.js only.

```ts
if (!isNodeEnvProduction()) {
  console.debug('Debug info');
}
```

### `Regexp`

| Member                                 | Description                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Regexp.email`                         | Regular expression matching an email address                                                  |
| `Regexp.phone`                         | Regular expression matching a phone number (international formats, with optional separators)  |
| `Regexp.removeExtraSpaces(s)`          | Trims the string and collapses consecutive whitespace into a single space                     |
| `Regexp.escapePattern(s)`              | Escapes regular expression special characters, so the string can be matched literally         |
| `Regexp.getMatchAnyRegExp(s)`          | Global, case-insensitive `RegExp` matching **any** of the space-separated words of `s`        |
| `Regexp.getMatchAllRegExp(s)`          | Global, case-insensitive `RegExp` matching **all** the space-separated words of `s`, in order |
| `Regexp.getFullMatchRegExp(s, flags?)` | `RegExp` matching exactly `s` (case-insensitive by default)                                   |

```ts
Regexp.email.test('john.doe@example.com'); // true
Regexp.removeExtraSpaces('  hello    world '); // 'hello world'

// Simple search helpers
'Learning TypeScript'.match(Regexp.getMatchAnyRegExp('typescript angular')); // ['TypeScript']
Regexp.getMatchAllRegExp('learn script').test('Learning TypeScript'); // true
Regexp.getFullMatchRegExp('1+1').test('1+1'); // true (special characters are escaped)
```

### `Typings`

Type guards and conversions:

| Method                  | Returns `true` for                                          |
| ----------------------- | ----------------------------------------------------------- |
| `Typings.isDefined(v)`  | anything but `undefined` (`null` is defined)                |
| `Typings.isString(v)`   | strings                                                     |
| `Typings.isNumber(v)`   | finite numbers (not `NaN` or `Infinity`)                    |
| `Typings.isBoolean(v)`  | `true` and `false`                                          |
| `Typings.isArray(v)`    | arrays                                                      |
| `Typings.isFunction(v)` | functions                                                   |
| `Typings.isObject(v)`   | plain objects (`{}`), not arrays, class instances or `null` |

`Typings.toString(v)` converts any value to a string, returning `''` for `null` and `undefined`.

```ts
function format(value: unknown): string {
  if (Typings.isNumber(value)) {
    return value.toFixed(2); // value is a number here
  }
  return Typings.toString(value);
}
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
