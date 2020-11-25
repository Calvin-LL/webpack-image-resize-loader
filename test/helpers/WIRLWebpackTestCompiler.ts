import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WIRLCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
}

export default class WIRLWebpackTestCompiler extends WebpackTestCompiler {
  compile(options: WIRLCompileOptions = {}): Promise<WebpackTestBundle> {
    const { loaderOptions = {}, entryFileName = "index.js" } = options;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        {
          test: /(png|jpg|svg)/i,
          rules: [
            {
              loader: path.resolve(
                __dirname,
                "..",
                "..",
                "test-dist",
                "cjs.js"
              ),
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
