import { api } from './api';
import { getAllFilesToTransform, getFileInfo, writeFile } from './files';
import { loadTransform } from './transform';

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

/**
 * Perform a transformation across a set of files.
 */
export const perform = async (options: ProcessTransformOptions) => {
  const transform = await loadTransform(options.transform);
  const files = getAllFilesToTransform(options.files);

  files.map(file => {
    const fileInfo = getFileInfo(file);

    try {
      const result = transform(fileInfo, api);

      if (result !== null) {
        writeFile(file, result);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          `The following error occurred transforming "${file}":\n  ${err.message}`
        );
      } else {
        console.error(
          `An unexpected error occurred transforming "${file}": ${err}`
        );
      }
    }
  });
};
