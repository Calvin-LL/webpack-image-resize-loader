import path from "path";

import webpack from "webpack";

export default (
  asset: string,
  compiler: webpack.Compiler,
  stats: webpack.Stats
) => {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;
  let data = "";

  try {
    // @ts-ignore
    data = usedFs.readFileSync(path.join(outputPath, asset)).toString();
  } catch (error) {
    data = error.toString();
  }

  return data;
};
