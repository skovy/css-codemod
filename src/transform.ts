import { bundleRequire } from 'bundle-require';
import { Parser } from 'postcss';
import { TransformAPI } from './api';
import { TransformFileInfo } from './files';

const MINIMUM_TRANSFORM_EXAMPLE = `
  import { Transform } from "css-codemod";

  export const transform: Transform = (fileInfo, api) => {};
`;

export type Transform = (
  /**
   * Metadata for the current file being transformed.
   */
  fileInfo: TransformFileInfo,

  /**
   * Helpers injected by css-codemod.
   */
  api: TransformAPI
) => null | string;

/**
 * Validate the general structure of the transform to catch simple errors.
 */
export const validateTransform = (transform: unknown): Transform => {
  if (typeof transform === 'function' && transform.length <= 2) {
    return transform as Transform;
  } else {
    console.error(
      `Transform file must export a valid transform. For example:\n${MINIMUM_TRANSFORM_EXAMPLE}`
    );
    process.exit(1);
  }
};

interface LoadTransformResult {
  transform: Transform;
  parser?: Parser;
}

/**
 * Load and validate the transform file given the filepath.
 */
export const loadTransform = async (
  filepath: string
): Promise<LoadTransformResult> => {
  try {
    const { mod } = await bundleRequire({ filepath });
    const transform = validateTransform(mod.transform || mod.default);
    const parser = mod.parser;
    return { transform, parser };
  } catch (err) {
    console.error(
      `An error occurred loading the transform file. Verify "${filepath}" exists.`
    );
    process.exit(1);
  }
};
