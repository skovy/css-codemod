# :snake: css-codemod

css-codemod is a toolkit for running codemods (a.k.a. transforms) over many CSS files.

Powered by [PostCSS](https://postcss.org) so the existing tooling and community can be leveraged.

- Any [PostCSS syntax parser and stringifier](https://github.com/postcss/postcss/blob/main/docs/syntax.md) can be added.
- Any [PostCSS plugin](https://github.com/postcss/postcss/blob/main/docs/plugins.md) can be added,

## Install

There are a few ways to use css-codemod.

First, using [npx](https://www.npmjs.com/package/npx) to execute the transform without need to explicitly install `css-codemod`.

```bash
npx css-codemod "./src/**/*.css" -t ./transform.ts
```

Second, install `css-codemod` as a dependency and execute with your package manager of choice.

```bash
yarn add -D css-codemod
yarn css-codemod "./src/**/*.css" -t ./transform.ts
```

Third, install `css-codemod` globally.

```
yarn add -g css-codemod
css-codemod "./src/**/*.css" -t ./transform.ts
```

## Usage (CLI)

The CLI provides the following options:

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

This will pass the source of all files through the transform function specified with `-t` or `--transform` (defaults to `./transform.ts`). See the following sections for more details on the transform function and API.

## Transform

The transform function defines the transformation to make to each file. The transform can be written in either JavaScript or TypeScript, but TypeScript is recommended.

The transform function needs to be a named `transform` export from the transform file.

```ts
// transform.ts

// Import the `Transform` type to provide type-safety when
// using and creating a transform function.
import { Transform } from 'css-codemod';

// Define a named `transform` export function.
export const transform: Transform = (fileInfo, api) => {
  // Implement the transform.
  // See below for more details on the API.
};

// Optionally defined a named `parser` export to configure the PostCSS parser.
//   Docs: https://postcss.org/api/#parser
// export const parser = ...;
```

## API

### `Transform`

Define a transform function.

This type is provided to explicitly type the exported `transform` function. In general, this should be the only type that needs to be explicitly imported. The expected return value is either a string or `null`.

- When returned a string it will be written back to the original file. - When returned `null`, nothing happens and the original file is skipped.

### `TransformFileInfo`

The first argument passed to the `transform` function.

It's an object with metadata about the current file being processed by the transform.

- `path`: the resolved path of the file being transformed.
- `source`: the file contents source of the file being transformed.

### `TransformAPI`

The second argument passed to the `transform` function.

It's an object with helpers provided by `css-codemod` to perform transformations.

- `parse`: parse a raw CSS string into an AST. This returns the root node of the underlying abstract syntax tree. Transformations can be made by making direct mutations to the underlying node. This is performed with [PostCSS](https://postcss.org/) so the returned node is a PostCSS [Root](https://postcss.org/api/#root) node. Refer to the [PostCSS API documentation](https://postcss.org/api/) for documentation on nodes and various helpers.

### Example

```ts
// transform.ts

import { Transform } from 'css-codemod';
import { parse, stringify } from 'postcss-scss';

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
  // Note: in this example the `postcss-scss` package is used to add
  // SCSS syntax support. The stringifier is passed when we call `toString` to
  // re-output valid SCSS syntax.
  return root.toString(stringify);
};

// Note: in this example the `postcss-scss` package is used to add SCSS syntax support.
// This configures PostCSS to correctly parse SCSS syntax.
//   Docs: https://postcss.org/api/#parser
export const parser = parse;
```

### PostCSS

[PostCSS](https://postcss.org) is the core tool used for performing code transformations. As a result, much of it's API is re-surfaced in this toolkit and will link to it's documentation.

### AST Explorer

[AST Explorer](https://astexplorer.net) is recommended when working on transforms. Change the language to "CSS" and the parser to "postcss" to see the underlying abstract syntax tree for a given snippet of CSS. This makes it much easier to understand the transformations that need to be made.

## Motivation

**css-codemod** is inspired by tools like [`jscodeshift`](https://github.com/facebook/jscodeshift) to streamline CSS transformations whether it be an evolving codebase, or adopting newer syntax.

Read [CSS codemods with PostCSS](https://www.skovy.dev/blog/css-codemods-with-postcss) for a conceptual overview of how this toolkit works.
