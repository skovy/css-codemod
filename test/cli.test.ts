import { execSync } from 'child_process';
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

const bin = path.resolve(__dirname, '..', 'dist', 'cli.js');
const cache = path.resolve(__dirname, '.cache');

const run = (recipe: string) => {
  // Setup the test files
  const originalInput = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'input'
  );
  const inputDest = path.resolve(cache, recipe);
  console.log({ originalInput, inputDest });
  fs.copySync(originalInput, inputDest);

  // Run the command
  const transform = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'transform.ts'
  );
  const inputGlob = path.join(inputDest, '**', '*.css');
  const command = `${bin} -t ${transform} '${inputGlob}'`;

  console.log({ transform, inputGlob, command });
  try {
    execSync(command);
  } catch (err) {
    console.error(`Error executing command: ${command}`);
    console.error(err);
  }

  // Compare results
  const expectedOutput = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'output'
  );
  const expectedOutputGlob = path.join(expectedOutput, '**', '*.css');
  const expectedFiles = glob.sync(expectedOutputGlob);

  expectedFiles.forEach(expectedFile => {
    const uniquePath = path.relative(expectedOutput, expectedFile);
    const actualFilePath = path.join(inputDest, uniquePath);
    const expectedContent = fs.readFileSync(expectedFile).toString();
    const actualContent = fs.readFileSync(actualFilePath).toString();
    expect(actualContent).toEqual(expectedContent);
  });
};

const recipes = fs.readdirSync(path.resolve(__dirname, '..', 'recipes'));
console.log({ recipes });
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
