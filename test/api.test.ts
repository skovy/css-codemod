import { Declaration, Rule } from 'postcss';
import { api } from '../src/api';

describe('api', () => {
  describe('#parse', () => {
    it('should return the root node of an abstract syntax tree', () => {
      const root = api.parse(`.class { color: orange; }`);

      expect(root.type).toEqual('root');
      expect(root.nodes.length).toEqual(1);

      const rule = root.nodes[0] as Rule;
      expect(rule.type).toEqual('rule');
      expect(rule.nodes.length).toEqual(1);

      const declaration = rule.nodes[0] as Declaration;
      expect(declaration.type).toEqual('decl');
      expect(declaration.prop).toEqual('color');
      expect(declaration.value).toEqual('orange');
    });
  });
});
