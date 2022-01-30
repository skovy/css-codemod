import { Transform } from '../../src';
import calc from 'postcss-calc';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);
  return root.toString();
};

export const plugins = [calc({})];
