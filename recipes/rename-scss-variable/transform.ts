import { Transform } from '../../src';
import { parse, stringify } from 'postcss-scss';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);

  root.walk(node => {
    if (node.type === 'decl' && node.value === '$old-color-var') {
      node.value = '$new-color-var';
    }
  });

  return root.toString(stringify);
};

export const parser = parse;
