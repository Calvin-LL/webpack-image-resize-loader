import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)("v%d queries", (webpackVersion) => {
  test('should be overridden by json query `{"width": 10}`', async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 100,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
      fileContentOverride: `require('./Macaca_nigra_self-portrait_large.jpg?{"width": 10}')`,
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });

  test("should be overridden by query scale=1.2&scaleUp=true", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        scale: 1,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
      fileContentOverride:
        'require("./Macaca_nigra_self-portrait_large.jpg?scale=1.2&scaleUp=true")',
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "1.2x-80q",
    });
  });
});
