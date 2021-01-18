import path from "path";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

describe.each([4, 5] as const)(
  'v%d "fileLoaderOptionsGenerator" option',
  (webpackVersion) => {
    it("should work with options in query", async () => {
      const loaderPath = path.resolve(__dirname, "../../test-dist/cjs.js");
      const loaderOptions = {
        width: 10,
      };
      const loaderOptionsString = JSON.stringify(loaderOptions);
      const fileLoaderOptions = {
        name: "test.[ext]",
        esModule: false,
      };
      const fileLoaderOptionsString = JSON.stringify(fileLoaderOptions);

      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require('-!file-loader?${fileLoaderOptionsString}!${loaderPath}?${loaderOptionsString}!./Macaca_nigra_self-portrait_large.jpg');`,
      });

      expect(bundle.execute("main.js")).toMatch("test.jpeg");
    });

    it('should work with file-loader not having "name" option', async () => {
      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          width: 10,
        },
        fileLoaderOptions: {},
      });

      expect(bundle.execute("main.js")).toMatch(/\.jpeg$/);
    });

    it('should work with file-loader having { name: "test.[ext]" }', async () => {
      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          width: 10,
        },
        fileLoaderOptions: {
          name: "test.[ext]",
        },
      });

      expect(bundle.execute("main.js")).toMatch("test.jpeg");
    });

    it('should work with file-loader having { name: () => "test.[ext]" }', async () => {
      const mockName = jest.fn().mockReturnValue("test.[ext]");
      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          width: 10,
        },
        fileLoaderOptions: {
          name: (...args: any) => mockName(...args),
        },
      });

      expect(bundle.execute("main.js")).toMatch("test.jpeg");

      expect(mockName).toHaveBeenCalledTimes(1);
    });

    it("should call fileLoaderOptionsGenerator", async () => {
      const mockFileLoaderOptionsGenerator = jest.fn().mockReturnValue({
        esModule: false,
        name: "test.jpg",
      });

      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          width: 10,
          fileLoaderOptionsGenerator: (...args: any) =>
            mockFileLoaderOptionsGenerator(...args),
        },
        fileLoaderOptions: {
          name: "[name]-[contenthash].[ext]",
          test: 3,
        },
      });

      expect(bundle.execute("main.js")).toMatch("test.jpg");

      expect(mockFileLoaderOptionsGenerator).toHaveBeenCalledTimes(1);
      expect(mockFileLoaderOptionsGenerator.mock.calls[0][0]).toMatchObject({
        format: "jpeg",
      });
    });

    it("should call fileLoaderOptionsGenerator as a string", async () => {
      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          width: 10,
          fileLoaderOptionsGenerator:
            '() => ({ esModule: false, name: "test.jpg" })',
        },
        fileLoaderOptions: {
          name: "[name]-[contenthash].[ext]",
          test: 3,
        },
      });

      expect(bundle.execute("main.js")).toMatch("test.jpg");
    });
  }
);
