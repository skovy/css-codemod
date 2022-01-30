import { Transform } from '../../src';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);

  root.walk(node => {
    if (node.type === 'rule') {
      node.selector = node.selector.toUpperCase();
    }
  });

  return root.toString();
};
