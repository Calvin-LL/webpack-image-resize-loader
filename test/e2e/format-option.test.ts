import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "format" option', (webpackVersion) => {
  it("should work with jpeg", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        format: "jpeg",
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

  it("should work with png", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        format: "png",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it("should work with webp", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        format: "webp",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it("should work with tiff", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        format: "tiff",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
