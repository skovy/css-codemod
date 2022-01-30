import postcss, { Root, Parser } from 'postcss';
export interface TransformAPI {
  /**
   * Parse a raw CSS string into an abstract syntax tree and return a PostCSS `Root` node.
   */
  parse(source: string): Root;
}

const createAPIParse = ({
  parser,
}: {
  parser?: Parser;
}): TransformAPI['parse'] => {
  const parse: TransformAPI['parse'] = source => {
    const result = postcss().process(source, {
      // Silence warning about sourcemaps. Not relevant to this use case.
      from: undefined,
      parser,
    });

    // Explicitly destructure root, which lazy evaluates and populates an error
    // if one occurs. The error field can then be checked.
    const { root } = result;

    // Re-surface any PostCSS parsing errors.
    // https://github.com/postcss/postcss/issues/1708
    if ((result as any).error) {
      throw (result as any).error;
    }

    if (root?.type === 'root') {
      return root;
    } else {
      throw new Error(`Unexpected root node: ${root}`);
    }
  };

  return parse;
};

export const createAPI = ({
  parser,
}: { parser?: Parser } = {}): TransformAPI => {
  const api: TransformAPI = {
    parse: createAPIParse({ parser }),
  };

  return api;
};
