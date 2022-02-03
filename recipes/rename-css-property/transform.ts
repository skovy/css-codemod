import { Transform } from '../../src';

const OLD_VAR = '--old-color';
const NEW_VAR = '--new-color';

export const transform: Transform = (fileInfo, api) => {
  const root = api.parse(fileInfo.source);

  root.walkDecls(decl => {
    if (decl.prop === OLD_VAR) {
      // Replace any custom property declarations.
      //   eg: `--custom-prop: #fff`
      decl.prop = NEW_VAR;
    } else {
      // Replace any uses of the custom property in values.
      //  eg: `border: 2px solid var(--custom-prop);`
      const result = api.parseValue(decl.value);

      result.walk(value => {
        if (value.type === 'word' && value.value === OLD_VAR) {
          value.value = NEW_VAR;
        }
      });

      decl.value = result.toString();
    }
  });

  return root.toString();
};
