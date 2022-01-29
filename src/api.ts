import postcss, { Root } from 'postcss';

export interface TransformAPI {
  parse(source: string): Root;
}

const parse: TransformAPI['parse'] = source => {
  return postcss.parse(source);
};

export const api: TransformAPI = { parse };
