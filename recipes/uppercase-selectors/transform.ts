import { Transform } from '../../src';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);

  root.walk(node => {
    if (node.type === 'rule') {
      node.selector = node.selector.toUpperCase();
    }
  });

  // Or, using more specific PostCSS helpers.
  //   Docs: https://postcss.org/api/#rule-walkrules
  root.walkRules(rule => {
    rule.selector = rule.selector.toUpperCase();
  });

  return root.toString();
};
