import { loadTransform } from './load-transform';

interface ProcessTransformOptions {
  /**
   * The list of file paths to process and run through the transform.
   */
  files: string[];

  /**
   * The transform path to run each file through.
   */
  transform: string;
}

export const processTransform = async (options: ProcessTransformOptions) => {
  console.log(options);
  const transform = await loadTransform(options.transform);

  transform();
};
