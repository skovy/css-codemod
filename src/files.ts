import fs from 'fs';
import glob from 'glob';

export interface TransformFileInfo {
  /**
   * The file path for the current file being transformed.
   */
  path: string;

  /**
   * The file contents for the current file being transformed.
   */
  source: string;
}

/**
 * Construct file metadata given a file path.
 */
export const getFileInfo = (file: string): TransformFileInfo => {
  try {
    const source = fs.readFileSync(file, 'utf8').toString();
    return { path: file, source };
  } catch (err) {
    console.error(`An error occurred trying to read "${file}": ${err}`);
    process.exit(1);
  }
};

/**
 * Write contents to the given file.
 */
export const writeFile = (file: string, contents: string): void => {
  try {
    fs.writeFileSync(file, contents);
  } catch (err) {
    console.error(`An error occurred trying to write "${file}": ${err}`);
  }
};

/**
 * Return an array of file paths that matches the given files string.
 */
export const getAllFilesToTransform = (files: string) =>
  glob.sync(files, { nodir: true });
