import { traverse } from '../src';
import * as colorToRed from './examples/color-to-red';
import * as uppercaseSelectors from './examples/uppercase-selectors';

const cases = [colorToRed, uppercaseSelectors];

describe('traverse', () => {
  it.each(cases)('should convert the input', async processors => {
    expect(await traverse(processors.input, processors.default)).toEqual(
      processors.output
    );
  });
});
