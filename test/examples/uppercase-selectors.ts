import { Processors } from '../../src';

const processors: Processors = {
  Rule(rule) {
    rule.selector = rule.selector.toUpperCase();
  },
};

export default processors;

export const input = `
.class { 
  background: green;
}

.another-selector {
  color: orange;
}
`;

export const output = `
.CLASS { 
  background: green;
}

.ANOTHER-SELECTOR {
  color: orange;
}
`;
