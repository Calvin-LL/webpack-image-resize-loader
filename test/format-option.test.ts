import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "format" option', (webpackVersion) => {
  test("should work with jpeg", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      format: "jpeg",
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

  test("should work with png", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      format: "png",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should work with webp", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      format: "webp",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should work with tiff", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      format: "tiff",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
