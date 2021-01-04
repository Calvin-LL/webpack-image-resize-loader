import path from "path";

import {
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WIRLCompileOptions
  extends Omit<WebpackTestCompiler.CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
}

export default class WIRLWebpackTestCompiler extends WebpackTestCompiler.default {
  compile(
    options: WIRLCompileOptions = {}
  ): Promise<WebpackTestBundle.default> {
    const { loaderOptions = {}, entryFileName = "index.js" } = options;
    const fixturesDir = path.resolve(__dirname, "../fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "../outputs"),
      rules: [
        {
          test: /\.(png|jpg|svg)$/i,
          use: [
            {
              loader: path.resolve(__dirname, "../../../test-dist/cjs.js"),
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
    };

    return super.compile({
      ...options,
      entryFilePath: path.resolve(fixturesDir, entryFileName),
    });
  }
}
