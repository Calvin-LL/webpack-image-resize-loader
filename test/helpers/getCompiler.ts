import fs from "fs";
import path from "path";

import { IFs, Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";
import webpack5 from "webpack5";

export default (
  webpackVersion: 4 | 5,
  loaderOptions?: any,
  fileName = "index.js",
  fileContent?: string
) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, fileName),
    output: {
      publicPath: "",
      path: path.resolve(__dirname, "..", "outputs"),
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
              options: {
                ...loaderOptions,
                fileLoaderOptions: {
                  esModule: false,
                  ...loaderOptions?.fileLoaderOptions,
                },
              },
            },
          ],
        },
      ],
    },
  };

  const wp = (webpackVersion === 5 ? webpack5 : webpack) as typeof webpack;
  const compiler = wp(fullConfig as webpack.Configuration);

  const vol = new Volume();
  const virtualFileSystem = createFsFromVolume(vol) as IFs & {
    join: typeof path.join;
  };

  virtualFileSystem.join = path.join.bind(path);

  if (fileContent) {
    const entryFilePath = path.resolve(fixturesDir, fileName);

    overrideReadFile(vol, virtualFileSystem, entryFilePath, fileContent);

    compiler.inputFileSystem = fs;
  }

  compiler.outputFileSystem = virtualFileSystem;

  return compiler;
};

function overrideReadFile(
  vol: InstanceType<typeof Volume>,
  virtualFileSystem: IFs,
  filePath: string,
  fileContent: string
) {
  vol.fromJSON({
    [filePath]: fileContent,
  });

  const fsReadFile = fs.readFile;
  const fsReadFileSync = fs.readFileSync;

  // @ts-ignore
  fs.readFile = function (path) {
    if (path === filePath)
      // @ts-ignore
      return virtualFileSystem.readFile.apply(null, arguments);

    // @ts-ignore
    return fsReadFile.apply(null, arguments);
  };

  // @ts-ignore
  fs.readFileSync = function (path) {
    if (path === filePath)
      // @ts-ignore
      return virtualFileSystem.readFileSync.apply(null, arguments);

    // @ts-ignore
    return fsReadFileSync.apply(null, arguments);
  };
}
