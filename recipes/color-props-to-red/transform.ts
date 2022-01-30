import { Transform } from '../../src';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);

  root.walk(node => {
    if (node.type === 'decl' && node.prop === 'color') {
      node.value = 'red';
    }
  });

  return root.toString();
};
