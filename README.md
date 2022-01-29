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
  [files]  File path to transform. Glob patterns are supported.

For more info, run any command with the `--help` flag:
  $ css-codemod --help

Options:
  -t, --transform <transform>  Path to the transform file (default: ./transform.ts)
  -h, --help                   Display this message
  -v, --version                Display version number

Examples:
css-codemod ./a.css
css-codemod ./src/a.css
css-codemod ./src/**/*.css
css-codemod ./**/*.css
```

## API

TODO(Document transform function API)

### PostCSS

[PostCSS](https://postcss.org) is the core tool used for performing code transformations. As a result, much of it's API is re-surfaced in this toolkit and will link to it's documentation.

## Motivation

**css-codemod** is inspired by tools like [`jscodeshift`](https://github.com/facebook/jscodeshift) to streamline CSS transformations whether it be an evolving codebase, or adopting newer syntax.
