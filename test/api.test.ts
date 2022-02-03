import { Declaration, Rule } from 'postcss';
import { FunctionNode } from 'postcss-value-parser';
import { createAPI } from '../src/api';

describe('api', () => {
  const api = createAPI();

  describe('#parse', () => {
    it('should return the root node of an abstract syntax tree', () => {
      const root = api.parse(`.class { color: orange; }`);

      expect(root.type).toEqual('root');
      expect(root.nodes).toHaveLength(1);

      const rule = root.nodes[0] as Rule;
      expect(rule.type).toEqual('rule');
      expect(rule.nodes).toHaveLength(1);

      const declaration = rule.nodes[0] as Declaration;
      expect(declaration.type).toEqual('decl');
      expect(declaration.prop).toEqual('color');
      expect(declaration.value).toEqual('orange');
    });
  });

  describe('#parseValue', () => {
    it('should return the value nodes', () => {
      const { nodes } = api.parseValue(`1px solid var(--custom-prop)`);
      expect(nodes).toHaveLength(5);

      let [word1, space1, word2, space2, func1] = nodes;

      expect(word1.type).toBe('word');
      expect(word1.value).toBe('1px');

      expect(space1.type).toBe('space');
      expect(space1.value).toBe(' ');

      expect(word2.type).toBe('word');
      expect(word2.value).toBe('solid');

      expect(space2.type).toBe('space');
      expect(space2.value).toBe(' ');

      func1 = func1 as FunctionNode;
      expect(func1.type).toBe('function');
      expect(func1.value).toBe('var');
      expect(func1.nodes).toHaveLength(1);
      const [word3] = func1.nodes;
      expect(word3.type).toBe('word');
      expect(word3.value).toBe('--custom-prop');
    });
  });
});
