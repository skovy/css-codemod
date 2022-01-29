interface TransformFileInfo {}

interface TransformAPI {}

export type Transform = (
  fileInfo: TransformFileInfo,
  api: TransformAPI
) => null | string;
