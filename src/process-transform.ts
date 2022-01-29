import glob from 'glob';
import fs from 'fs';
import { loadTransform } from './load-transform';
import { TransformFileInfo } from './transform';
import { api } from './api';

interface ProcessTransformOptions {
  /**
   * The file path to process and run through the transform.
   */
  files: string;

  /**
   * The transform path to run each file through.
   */
  transform: string;
}

export const processTransform = async (options: ProcessTransformOptions) => {
  const transform = await loadTransform(options.transform);
  const files = glob.sync(options.files);

  files.map(file => {
    const source = fs.readFileSync(file, 'utf8').toString();
    const fileInfo: TransformFileInfo = { path: file, source };
    const result = transform(fileInfo, api);

    console.log(result);

    if (result !== null) {
      fs.writeFileSync(file, result);
    }
  });
};
