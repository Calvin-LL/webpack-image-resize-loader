import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "preserveRotation" option', (webpackVersion) => {
  test("image with no EXIF rotation unchanged", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      preserveRotation: true,
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
      customSnapshotIdentifier: "10w-80q",
    });
  });

  test("image with EXIF rotation not rotated when option false", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 48,
      preserveRotation: false,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    }, 'withExifRotation.js');
    const stats = await compile(webpackVersion, compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "f-not-rotated",
    });
  });

  test("image with EXIF rotation rotated when option true", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 48,
      preserveRotation: true,
      fileLoaderOptions: {
        name: "image.jpg",
      },
    }, 'withExifRotation.js');
    const stats = await compile(webpackVersion, compiler);

    expect(
      await convertToPng(
        readAsset("image.jpg", compiler, stats as webpack.Stats, true)
      )
    ).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "f-rotated",
    });
  });
});
