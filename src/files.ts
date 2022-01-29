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

export const getFileInfo = (file: string): TransformFileInfo => {
  try {
    const source = fs.readFileSync(file, 'utf8').toString();
    return { path: file, source };
  } catch (err) {
    console.error(`An error occurred trying to read "${file}": ${err}`);
    process.exit(1);
  }
};

export const writeFile = (file: string, contents: string): void => {
  try {
    fs.writeFileSync(file, contents);
  } catch (err) {
    console.error(`An error occurred trying to write "${file}": ${err}`);
  }
};

export const getAllFilesToTransform = (files: string) => glob.sync(files);
