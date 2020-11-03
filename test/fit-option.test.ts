import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "fit" option', (webpackVersion) => {
  test("should work with cover", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 10,
      fit: "cover",
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-10h-80q",
    });
  });

  test("should work with contain", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 10,
      fit: "contain",
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-10h-80q-contain",
    });
  });

  test("should work with fill", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 10,
      fit: "fill",
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-10h-80q-fill",
    });
  });
});
