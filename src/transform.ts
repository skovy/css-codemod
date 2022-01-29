import { TransformAPI } from './api';

export interface TransformFileInfo {
  /**
   * The file path for the current file being transformed.
   */
  path: string;

  /**
   * The file contents for the current file being transformed.
   */
  source: string;
}

export type Transform = (
  /**
   * Metadata for the current file being transformed.
   */
  fileInfo: TransformFileInfo,
  api: TransformAPI
) => null | string;
