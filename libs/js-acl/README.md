# @nicolabello/js-acl

[![npm](https://img.shields.io/npm/v/@nicolabello/js-acl.svg)](https://www.npmjs.com/package/@nicolabello/js-acl)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

A lightweight, flexible and dependency-free access control list (ACL) implementation for managing privileges, inspired by [Zend ACL](https://framework.zend.com/manual/2.4/en/modules/zend.permissions.acl.intro.html).

- Hierarchical **roles** and **resources**: children inherit their parent's privileges
- **Allow / deny** rules on any combination of roles, resources and privileges
- Deny by default
- Fully typed: use your own types (e.g. enums) for roles, resources and privileges
- Works in the browser and in Node.js (ES modules and CommonJS)

## Installation

```bash
npm install @nicolabello/js-acl
```

## Import

```ts
import { Acl } from '@nicolabello/js-acl';
```

```js
const { Acl } = require('@nicolabello/js-acl');
```

## Usage example

Create a new ACL:

```js
const acl = new Acl();
```

Add the roles to match the following structure:

```
guest
authenticated
├── editor
└── admin
```

```js
acl.addRole('guest');
acl.addRole('authenticated');
acl.addRole('editor', 'authenticated');
acl.addRole('admin', 'authenticated');
```

Add the resources to match the following structure:

```
restricted-area
├── admin-area
└── articles
    └── created-articles
```

```js
acl.addResource('restricted-area');
acl.addResource('admin-area', 'restricted-area');
acl.addResource('articles', 'restricted-area');
acl.addResource('created-articles', 'articles');
```

Allow / deny privileges:

```js
// Authenticated users can navigate to the restricted area
acl.allow('authenticated', 'restricted-area', 'navigate');

// Only admins can navigate to the admin area
acl.deny('authenticated', 'admin-area', 'navigate');
acl.allow('admin', 'admin-area', 'navigate');

// Editors can add articles and edit their own
acl.allow('editor', 'articles', 'add');
acl.allow('editor', 'created-articles', 'edit');

// Authenticated users can like all articles, but not their own
acl.allow('authenticated', 'articles', 'like');
acl.deny('authenticated', 'created-articles', 'like');
```

Query privileges:

```js
acl.isAllowed('authenticated', 'restricted-area', 'navigate'); // true
acl.isAllowed('editor', 'restricted-area', 'navigate'); // true

acl.isAllowed('authenticated', 'admin-area', 'navigate'); // false
acl.isAllowed('admin', 'admin-area', 'navigate'); // true
acl.isAllowed('editor', 'admin-area', 'navigate'); // false

acl.isAllowed('authenticated', 'articles', 'add'); // false
acl.isAllowed('editor', 'articles', 'add'); // true

acl.isAllowed('authenticated', 'articles', 'like'); // true
acl.isAllowed('authenticated', 'created-articles', 'like'); // false
acl.isAllowed('editor', 'created-articles', 'like'); // false
```

## How rules are resolved

When querying `isAllowed(role, resource, privilege)`:

1. The most specific rule wins. Rules for the role itself are checked before the rules of its parent roles, and rules for the resource itself before the rules of its parent resources.
2. For each role/resource pair, a rule for the specific privilege takes precedence over a rule for all privileges (`null`).
3. If no rule matches, access is **denied**.
4. Unknown roles and resources are always denied.

## Documentation

### Create a new ACL

```js
const acl = new Acl();
```

By default, roles, resources and privileges can be strings or numbers. With TypeScript you can use your own types:

```ts
enum Role {
  Guest,
  Authenticated,
  Editor,
  Admin,
}

enum Resource {
  RestrictedArea,
  AdminArea,
  Articles,
  CreatedArticles,
}

enum Privilege {
  Navigate,
  Add,
  Like,
}

const acl = new Acl<Role, Resource, Privilege>();
```

### Add roles

```js
acl.addRole('guest');
```

Pass a parent as second parameter to inherit all the parent's privileges. The parent must have been added already: if it has not, the role is not added and `false` is returned.

```js
acl.addRole('editor', 'authenticated');
```

Use an array to add multiple roles at once, with or without a parent:

```js
acl.addRole(['guest', 'authenticated']);
acl.addRole(['editor', 'publisher'], 'authenticated');
```

### Add resources

```js
acl.addResource('restricted-area');
```

Pass a parent as second parameter to inherit all the parent's privileges (the parent must have been added already):

```js
acl.addResource('created-articles', 'articles');
```

Use an array to add multiple resources at once, with or without a parent:

```js
acl.addResource(['restricted-area', 'personal-area']);
acl.addResource(['admin-area', 'articles'], 'restricted-area');
```

### Allow / deny privileges

`null` means "all": all roles, all resources or all privileges. The privilege can be omitted, which is the same as passing `null`.

| Rule                                          | Allow                                          | Deny                                          |
| --------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| All privileges on all resources for all roles | `acl.allow(null, null)`                        | `acl.deny(null, null)`                        |
| A privilege on all resources for all roles    | `acl.allow(null, null, 'view')`                | `acl.deny(null, null, 'view')`                |
| All privileges on all resources for a role    | `acl.allow('admin', null)`                     | `acl.deny('admin', null)`                     |
| A privilege on all resources for a role       | `acl.allow('admin', null, 'edit')`             | `acl.deny('admin', null, 'edit')`             |
| All privileges on a resource for all roles    | `acl.allow(null, 'articles')`                  | `acl.deny(null, 'articles')`                  |
| A privilege on a resource for all roles       | `acl.allow(null, 'articles', 'view')`          | `acl.deny(null, 'articles', 'view')`          |
| All privileges on a resource for a role       | `acl.allow('admin', 'admin-area')`             | `acl.deny('admin', 'admin-area')`             |
| A privilege on a resource for a role          | `acl.allow('admin', 'admin-area', 'navigate')` | `acl.deny('admin', 'admin-area', 'navigate')` |

Arrays can be used in any of the above to allow / deny multiple roles, resources and privileges at once:

```js
acl.allow(['admin', 'publisher'], null, ['add', 'remove']);
acl.deny(null, ['article', 'category'], ['add', 'remove']);
```

### Query privileges

`isAllowed(role, resource, privilege?)` accepts the same `null` values:

```js
acl.isAllowed(null, null); // All privileges on all resources for all roles
acl.isAllowed(null, null, 'view'); // A privilege on all resources for all roles
acl.isAllowed('admin', null); // All privileges on all resources for a role
acl.isAllowed('admin', null, 'edit'); // A privilege on all resources for a role
acl.isAllowed(null, 'articles'); // All privileges on a resource for all roles
acl.isAllowed(null, 'articles', 'view'); // A privilege on a resource for all roles
acl.isAllowed('admin', 'admin-area'); // All privileges on a resource for a role
acl.isAllowed('admin', 'admin-area', 'navigate'); // A privilege on a resource for a role
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
