import { Processors } from '../../src';

const processors: Processors = {
  Declaration(decl) {
    if (decl.prop === 'color') {
      decl.value = 'red';
    }
  },
};

export default processors;

export const input = `.class { background: green; color: blue; margin: 42px; }`;

export const output = `.class { background: green; color: red; margin: 42px; }`;
