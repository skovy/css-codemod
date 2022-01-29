#!/usr/bin/env node

import { cac } from 'cac';
import { readFileSync } from 'fs';
import { join } from 'path';
import { processTransform } from './process-transform';

const PACKAGE_PATH = join(__dirname, '../package.json');
const PACKAGE_JSON = JSON.parse(readFileSync(PACKAGE_PATH, 'utf8'));
const NAME = PACKAGE_JSON.name;
const VERSION = PACKAGE_JSON.version;

const run = async () => {
  const cli = cac(`${NAME}`);

  cli
    .command('[files]', 'File path to transform. Glob patterns are supported.')
    .example(`${NAME} ./a.css`)
    .example(`${NAME} ./src/a.css`)
    .example(`${NAME} ./src/**/*.css`)
    .example(`${NAME} ./**/*.css`)
    .option('-t, --transform <transform>', 'Path to the transform file', {
      default: './transform.ts',
    })
    .action(async (files: string[], flags) => {
      const { transform } = flags;

      await processTransform({ files, transform });
    });

  cli.help();
  cli.version(VERSION);
  cli.parse(process.argv, { run: false });

  await cli.runMatchedCommand();
};

run();
