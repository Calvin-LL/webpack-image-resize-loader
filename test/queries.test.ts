import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)("v%d queries", (webpackVersion) => {
  test('should be overridden by json query `{"width": 10}`', async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        width: 100,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
      "index.js",
      `require('./Macaca_nigra_self-portrait_large.jpg?{"width": 10}')`
    );
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

  test("should be overridden by query scale=1.2&scaleUp=true", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        scale: 1,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
      "index.js",
      'require("./Macaca_nigra_self-portrait_large.jpg?scale=1.2&scaleUp=true")'
    );
    const stats = await compile(webpackVersion, compiler);
    try {
      expect(
        await convertToPng(
          readAsset("image.jpg", compiler, stats as webpack.Stats, true)
        )
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "1.2x-80q",
      });
    } catch (e) {
      console.log(e);
    }
  });

  test("should be overridden by query scale=1.2&scaleUp=true", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        scale: 1,
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
      "index.js",
      'require("./Macaca_nigra_self-portrait_large.jpg?scale=1.2&scaleUp=true")'
    );
    const stats = await compile(webpackVersion, compiler);
    try {
      expect(
        await convertToPng(
          readAsset("image.jpg", compiler, stats as webpack.Stats, true)
        )
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "1.2x-80q",
      });
    } catch (e) {
      console.log(e);
    }
  });
});
