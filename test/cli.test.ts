import execa from 'execa';
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

const bin = path.resolve(__dirname, '..', 'dist', 'cli.js');
const cache = path.resolve(__dirname, '.cache');

interface RunOptions {
  ext?: string;
}

const run = (recipe: string, { ext = 'css' }: RunOptions = {}) => {
  // Setup the test files
  const originalInput = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'input'
  );
  const inputDest = path.resolve(cache, recipe);
  fs.copySync(originalInput, inputDest);

  // Run the command
  const fileGlob = `*.${ext}`;
  const transform = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'transform.ts'
  );
  const inputGlob = path.join(inputDest, '**', fileGlob);
  const { stderr } = execa.sync(bin, ['-t', transform, inputGlob]);
  expect(stderr).toEqual('');

  // Compare results
  const expectedOutput = path.resolve(
    __dirname,
    '..',
    'recipes',
    recipe,
    'output'
  );
  const expectedOutputGlob = path.join(expectedOutput, '**', fileGlob);
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

const OPTIONS: Record<string, RunOptions> = {
  'rename-scss-variable': { ext: 'scss' },
};

describe('cli', () => {
  beforeAll(() => {
    fs.removeSync(cache);
  });

  afterAll(() => {
    // fs.removeSync(cache);
  });

  it.each(recipes)('should perform %s transform correctly', recipe => {
    run(recipe, OPTIONS[recipe]);
  });
});
