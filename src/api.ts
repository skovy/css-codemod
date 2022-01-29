import postcss, { Root } from 'postcss';

export interface TransformAPI {
  /**
   * Parse a raw CSS string into an abstract syntax tree and return a PostCSS `Root` node.
   */
  parse(source: string): Root;
}

const parse: TransformAPI['parse'] = source => {
  return postcss.parse(source);
};

export const api: TransformAPI = { parse };
