import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "width" option', (webpackVersion) => {
  it("should work with 10", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
      },
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });

  it("should work with 10000000", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10000000,
      },
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "original-80q",
    });
  });

  it("should work with 10 in query", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      fileLoaderOptions: {
        name: "image.jpg",
      },
      fileContentOverride:
        '__export__ = require("./Macaca_nigra_self-portrait_large.jpg?width=10");',
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });
});
