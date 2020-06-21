import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe('"height" option', () => {
  test("should work with 10", async () => {
    const compiler = getCompiler({
      height: 14,
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

  test("should work with 10000000", async () => {
    const compiler = getCompiler({
      height: 10000000,
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
});
