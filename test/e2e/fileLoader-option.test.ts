import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "fileLoader" option', (webpackVersion) => {
  it("should throw if fileLoader is not found in loaders array", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });

    await expect(async () => {
      await compiler
        .compile({
          loaderOptions: {
            width: 10,
            fileLoader: "webpack",
          },
          throwOnError: true,
        })
        .catch((e) => {
          throw e[0];
        });
    }).rejects.toThrowError(
      `Error: Can't find "webpack" in the list of loaders before webpack-image-resize-loader`
    );
  });

  it("should not throw if fileLoader is not specified and the default value of fileLoader (file-loader) is not found", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });

    // pretend file-loader has path "" so that it can't be found in the list of loaders
    // change if https://github.com/facebook/jest/issues/9543 is closed
    jest.doMock("../../test-dist/helpers/requireResolve", () => ({
      __esModule: true,
      default: () => "",
    }));

    await expect(
      compiler.compile({
        loaderOptions: {
          width: 10,
        },
        throwOnError: true,
      })
    ).resolves.toBeTruthy();
  });

  it("should work if fileLoader is loader path", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });

    await expect(
      compiler.compile({
        loaderOptions: {
          width: 10,
          fileLoader: require.resolve("file-loader"),
        },
        throwOnError: true,
      })
    ).resolves.toBeTruthy();
  });
});
