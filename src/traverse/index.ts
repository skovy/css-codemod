import postcss, { AcceptedPlugin, Plugin } from 'postcss';

// TODO: export `Processors` from `postcss`.
export type Processors = Omit<Plugin, 'postcssPlugin' | 'prepare'>;

const createTransformPlugin = (processors: Processors): Plugin => ({
  postcssPlugin: 'css-codemod-plugin',
  ...processors,
});

export const traverse = async (
  css: string,
  processors: Processors
): Promise<string | null> => {
  try {
    const plugins: AcceptedPlugin[] = [createTransformPlugin(processors)];

    const processor = postcss(plugins);

    const result = await processor.process(css, {
      // Explicitly set to undefined to silence a warning about sourcemaps.
      from: undefined,
    });

    return result.css;
  } catch (err) {
    console.error(
      `Unexpected error processing CSS.\n\nCSS string:\n${css}\n\nError:\n${err}`
    );
  }

  return null;
};
