import { execSync } from 'child_process';
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

const bin = './dist/cli.js';
const cache = path.join(__dirname, '.cache');

const run = (recipe: string) => {
  // Setup the test files
  const originalInput = `./recipes/${recipe}/input`;
  const inputDest = path.resolve(cache, recipe);
  fs.copySync(originalInput, inputDest);

  // Run the command
  const transform = `./recipes/${recipe}/transform.ts`;
  const inputGlob = `${inputDest}/**/*.css`;
  const command = `${bin} -t ${transform} '${inputGlob}'`;
  execSync(command);

  // Compare results
  const expectedOutput = `./recipes/${recipe}/output`;
  const expectedOutputGlob = `${expectedOutput}/**/*.css`;
  const expectedFiles = glob.sync(expectedOutputGlob);

  expectedFiles.forEach(expectedFile => {
    const uniquePath = path.relative(expectedOutput, expectedFile);
    const actualFilePath = path.join(inputDest, uniquePath);
    const expectedContent = fs.readFileSync(expectedFile).toString();
    const actualContent = fs.readFileSync(actualFilePath).toString();
    expect(actualContent).toEqual(expectedContent);
  });
};

const recipes = fs.readdirSync(path.resolve(__dirname, '../recipes'));

describe('cli', () => {
  beforeAll(() => {
    fs.removeSync(cache);
  });

  afterAll(() => {
    fs.removeSync(cache);
  });

  it.each(recipes)('should perform %s transform correctly', recipe => {
    run(recipe);
  });
});
