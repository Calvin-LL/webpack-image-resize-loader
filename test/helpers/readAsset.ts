import path from "path";

import { fs } from "memfs";
import webpack from "webpack";

export default (
  asset: string,
  compiler: webpack.Compiler,
  stats: webpack.Stats,
  readAsBuffer = false
) => {
  const usedFs = (compiler.outputFileSystem as unknown) as typeof fs;
  const outputPath = stats.compilation.outputOptions.path;

  try {
    if (readAsBuffer) {
      return usedFs.readFileSync(path.join(outputPath, asset));
    } else {
      return usedFs.readFileSync(path.join(outputPath, asset)).toString();
    }
  } catch (error) {
    return error.toString();
  }
};
