import { bundleRequire } from 'bundle-require';
import { Transform } from './transform';

const MINIMUM_EXAMPLE_TRANSFORM = `
  import { Transform } from "css-codemod";

  export const transform: Transform = (file, api) => {};
`;

/**
 * Validate the general structure of the transform to catch simple errors.
 */
const validateTransform = (transform: unknown): Transform => {
  if (typeof transform === 'function') {
    return transform as Transform;
  } else {
    console.error(
      `Transform file must export a valid transform. For example:\n${MINIMUM_EXAMPLE_TRANSFORM}`
    );
    process.exit(1);
  }
};

/**
 * Load and validate the transform file given the filepath.
 */
export const loadTransform = async (filepath: string): Promise<Transform> => {
  try {
    const { mod } = await bundleRequire({ filepath });
    const transform = validateTransform(mod.transform || mod.default);
    return transform;
  } catch (err) {
    console.error(
      `An error occurred loading the transform file. Verify "${filepath}" exists.`
    );
    process.exit(1);
  }
};
