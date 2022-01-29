import { bundleRequire } from 'bundle-require';
import { validateTransform, loadTransform, Transform } from '../src/transform';

jest.mock('bundle-require', () => ({ bundleRequire: jest.fn() }));

describe('transform', () => {
  let consoleError: jest.SpyInstance;
  let processExit: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation();
    processExit = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#validateTransform', () => {
    it('should return the transform when valid', () => {
      const empty: Transform = () => null;
      expect(validateTransform(empty)).toBe(empty);

      const oneArg: Transform = _fileInfo => null;
      expect(validateTransform(oneArg)).toBe(oneArg);

      const twoArg: Transform = (_fileInfo, _api) => null;
      expect(validateTransform(twoArg)).toBe(twoArg);

      expect(consoleError).not.toHaveBeenCalled();
      expect(processExit).not.toHaveBeenCalled();
    });

    it('should exit if an invalid transform is provided since there is no way to recover', () => {
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(processExit).toHaveBeenCalledTimes(0);

      validateTransform(null);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(processExit).toHaveBeenCalledTimes(1);

      validateTransform(undefined);
      expect(consoleError).toHaveBeenCalledTimes(2);
      expect(processExit).toHaveBeenCalledTimes(2);

      validateTransform((_fileInfo: any, _api: any, _invalid: any) => null);
      expect(consoleError).toHaveBeenCalledTimes(3);
      expect(processExit).toHaveBeenCalledTimes(3);
    });
  });

  describe('#loadTransform', () => {
    it('should load the transform file import the "transform" export', async () => {
      const transform: Transform = () => null;
      const def: Transform = () => null;

      (bundleRequire as jest.Mock).mockResolvedValue({
        mod: { transform, default: def },
      });

      expect(await loadTransform('./transform.ts')).toBe(transform);
      expect(consoleError).not.toHaveBeenCalled();
      expect(processExit).not.toHaveBeenCalled();
    });

    it('should load the transform file and fallback to the default export', async () => {
      const transform: Transform = () => null;

      (bundleRequire as jest.Mock).mockResolvedValue({
        mod: { default: transform },
      });

      expect(await loadTransform('./transform.ts')).toBe(transform);
      expect(consoleError).not.toHaveBeenCalled();
      expect(processExit).not.toHaveBeenCalled();
    });

    it('should exit if an error occurs loading the transform file', async () => {
      (bundleRequire as jest.Mock).mockRejectedValue(
        new Error('Cannot find file.')
      );

      await loadTransform('./transform.ts');
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(processExit).toHaveBeenCalledTimes(1);
    });
  });
});
