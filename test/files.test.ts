import fs from 'fs';
import path from 'path';
import { EOL } from 'os';
import { getAllFilesToTransform, getFileInfo, writeFile } from '../src/files';

describe('files', () => {
  let fsWriteFileSync: jest.SpyInstance;
  let consoleError: jest.SpyInstance;
  let processExit: jest.SpyInstance;

  beforeEach(() => {
    fsWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    consoleError = jest.spyOn(console, 'error').mockImplementation();
    processExit = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#getFileInfo', () => {
    it('should return file info for the file', () => {
      const testFile = path.join(__dirname, 'css', 'a.css');
      expect(getFileInfo(testFile)).toEqual({
        path: testFile,
        source: `.class {${EOL}  margin: 42px;${EOL}  color: blue;${EOL}  padding-right: 10em;${EOL}  background-color: rgba(0, 0, 0, 0.2);${EOL}}${EOL}`,
      });
      expect(consoleError).not.toHaveBeenCalled();
      expect(processExit).not.toHaveBeenCalled();
    });

    it('should exit if an error occurs reading a file', () => {
      const testFile = path.join(__dirname, 'css', 'totally-bogus.css');
      getFileInfo(testFile);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(processExit).toHaveBeenCalledTimes(1);
    });
  });

  describe('#writeFile', () => {
    it('should write the files contents', () => {
      writeFile('./testing.css', '.class {}');
      expect(fsWriteFileSync).toHaveBeenCalledTimes(1);
      expect(fsWriteFileSync).toHaveBeenCalledWith(
        './testing.css',
        '.class {}'
      );
      expect(consoleError).not.toHaveBeenCalled();
      expect(processExit).not.toHaveBeenCalled();
    });

    it('should print the error but not exit if an error occurs writing a file', () => {
      fsWriteFileSync.mockImplementation(() => {
        throw new Error('Cannot write to file.');
      });

      writeFile('./testing.css', '.class {}');
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(processExit).toHaveBeenCalledTimes(0);
    });
  });

  describe('#getAllFilesToTransform', () => {
    it('should expand the file path and return and array of resolved file paths', () => {
      expect(getAllFilesToTransform('./test/**/*.css')).toEqual([
        './test/css/a.css',
        './test/css/b.css',
      ]);
      expect(getAllFilesToTransform('./test/css/*.css')).toEqual([
        './test/css/a.css',
        './test/css/b.css',
      ]);
    });

    it('should ignore directories', () => {
      expect(getAllFilesToTransform('./test')).toEqual([]);
      expect(getAllFilesToTransform('./test/css')).toEqual([]);
    });
  });
});
