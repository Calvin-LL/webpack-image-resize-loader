import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe('"scale" option', () => {
  test("should work with 1", async () => {
    const compiler = getCompiler({
      scale: 1,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "original-80q",
    });
  });

  test("should work with 0.5", async () => {
    const compiler = getCompiler({
      scale: 0.5,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "0.5x-80q",
    });
  });

  test("width should take precedence", async () => {
    const compiler = getCompiler({
      width: 10,
      scale: 0.5,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });

  test("height should take precedence", async () => {
    const compiler = getCompiler({
      height: 14,
      scale: 0.5,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    });
    const stats = await compile(compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-80q",
    });
  });
});
