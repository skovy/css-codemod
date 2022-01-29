# :snake: css-codemod

css-codemod is a toolkit for running codemods (a.k.a. transforms) over many CSS files.

## Usage

There are two ways to use css-codemod.

First, using [npx](https://www.npmjs.com/package/npx) to execute the transform without need to explicitly install `css-codemod`.

```bash
npx css-codemod ./src/**/*.css -t ./transform.ts
```

Second, install `css-codemod` as a dependency and execute with your package manager of choice.

```bash
# Install and execute css-codemod with npm
npm i -D css-codemod
./node_modules/.bin/css-codemod ./src/**/*.css -t ./transform.ts

# Or, install and execute css-codemod with yarn
yarn add -D css-codemod
yarn css-codemod ./src/**/*.css -t ./transform.ts
```

## Transform

The transform file defines the transformations to define. The transform can be written in either JavaScript or TypeScript.

```ts
// transform.ts

// Import the `Transform` type to provide type-safety when
// using and creating a transform function.
import { Transform } from 'css-codemod';

// Define a named `transform` export.
// Note: it's important the function is named `transform` because that's
// what the tool expects.
export const transform: Transform = (file, api) => {
  // Implement the transform.
};
```

## CLI

```bash
Usage:
  $ css-codemod [files]

Commands:
  [files]  File path to transform. Note glob patterns are supported but must be wrapped in quotes.

For more info, run any command with the `--help` flag:
  $ css-codemod --help

Options:
  -t, --transform <transform>  Path to the transform file (default: ./transform.ts)
  -h, --help                   Display this message
  -v, --version                Display version number

Examples:
css-codemod ./a.css
css-codemod ./src/a.css
css-codemod "./src/**/*.css"
css-codemod "./**/*.css"
```

## API

### `Transform`

Define a transform function. This type is provided to explicitly type the exported `transform` function. In general, this should be the only type that needs to be imported. The expected return value is either a CSS string or `null`. When returned a CSS string that will be written back to the original file. When returned `null`, nothing happens and the original file is skipped.

### `TransformFileInfo`

The first argument passed to the `transform` function. It's an object with metadata about the current file being processed by the transform.

- `path`: the resolved path of the file being transformed.
- `source`: the file contents source of the file being transformed.

### `TransformAPI`

The second argument passed to the `transform` function. It's an object with helpers provided by `css-codemod` to perform transformations.

- `parse`: parse a raw CSS string into an AST. This returns the root node of the underlying abstract syntax tree to perform mutations. This is performed with [PostCSS](https://postcss.org/) so the returned node is a PostCSS [Root](https://postcss.org/api/#root) node. Refer to the [PostCSS API documentation](https://postcss.org/api/) for documentation and various helpers.

### Example

```ts
// transform.ts

import { Transform } from 'css-codemod';

export const transform: Transform = (fileInfo, api) => {
  // Convert the file source into an AST using the provided helper.
  const root = api.parse(fileInfo.source);

  // Use PostCSS helpers to walk through each descendant node
  //   Docs: https://postcss.org/api/#root-walk
  root.walk(node => {
    // Example logic to change all `color` declarations to have
    // a value of red.
    //
    // For example:
    //   `color: green;` -> `color: red;`
    //   `color: #fff;` -> `color: red;`
    //   `color: rgb(0, 0, 0);` -> `color: red;`
    if (node.type === 'decl' && node.prop === 'color') {
      node.value = 'red';
    }
  });

  // Convert the mutated AST back into a string.
  // Since a string is returned this will be written back to the file.
  return root.toString();
};
```

### PostCSS

[PostCSS](https://postcss.org) is the core tool used for performing code transformations. As a result, much of it's API is re-surfaced in this toolkit and will link to it's documentation.

## Motivation

**css-codemod** is inspired by tools like [`jscodeshift`](https://github.com/facebook/jscodeshift) to streamline CSS transformations whether it be an evolving codebase, or adopting newer syntax.
