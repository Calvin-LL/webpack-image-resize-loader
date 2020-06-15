import path from "path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";

export default (loaderOptions?: any, filename = "simple.js") => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "development",
    devtool: false,
    context: path.resolve(__dirname, "..", "fixtures"),
    entry: path.resolve(fixturesDir, filename),
    output: {
      path: path.resolve(__dirname, "..", "/outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg)/i,
          use: [
            {
              loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
              options: loaderOptions,
            },
          ],
        },
      ],
    },
  };

  const compiler = webpack(fullConfig as webpack.Configuration);

  const outputFileSystem = createFsFromVolume(new Volume());
  // Todo remove when we drop webpack@4 support
  // @ts-ignore
  outputFileSystem.join = path.join.bind(path);

  // @ts-ignore
  compiler.outputFileSystem = outputFileSystem;

  return compiler;
};
