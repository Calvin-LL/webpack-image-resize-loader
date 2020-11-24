import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "scale" option', (webpackVersion) => {
  test("should work with 1", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        scale: 1,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "original-80q",
    });
  });

  test("should work with 0.5", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        scale: 0.5,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "0.5x-80q",
    });
  });

  test("width should take precedence", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        scale: 0.5,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });

  test("height should take precedence", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        height: 14,
        scale: 0.5,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });
});
