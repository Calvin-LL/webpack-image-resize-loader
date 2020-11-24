import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "quality" option', (webpackVersion) => {
  test("should work with 80", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        quality: 80,
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

  test("should work with 80", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        quality: 80,
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

  test("should work with 1", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        quality: 1,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-1q",
    });
  });
});
