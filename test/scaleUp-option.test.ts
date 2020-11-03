import { toMatchImageSnapshot } from "jest-image-snapshot";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "scaleUp" option', (webpackVersion) => {
  test("should work with true when target width is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      scaleUp: true,
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

  test("should work with false when target width is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      scaleUp: false,
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

  test("should work with true when target width is large", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 3000,
      scaleUp: true,
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
      customSnapshotIdentifier: "3000w-80q",
    });
  });

  test("should work with false when target width is large", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 3000,
      scaleUp: false,
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
      customSnapshotIdentifier: "original-80q",
    });
  });

  test("should work with true when target width is small and height is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 10,
      scaleUp: true,
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

  test("should work with false when target width is small and height is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 10,
      scaleUp: false,
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

  test("should work with true when target width is small and height is large", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 5000,
      scaleUp: true,
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
      customSnapshotIdentifier: "10w-5000h-80q",
    });
  });

  test("should work with false when target width is small and height is large", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 10,
      height: 5000,
      scaleUp: false,
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
      customSnapshotIdentifier: "original-80q",
    });
  });

  test("should work with true when target width is large and height is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 5000,
      height: 10,
      scaleUp: true,
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
      customSnapshotIdentifier: "5000w-10h-80q",
    });
  });

  test("should work with false when target width is large and height is small", async () => {
    const compiler = getCompiler(webpackVersion, {
      width: 5000,
      height: 10,
      scaleUp: false,
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
      customSnapshotIdentifier: "original-80q",
    });
  });

  test("should work with true when target scale is <= 1", async () => {
    const compiler = getCompiler(webpackVersion, {
      scale: 0.5,
      scaleUp: true,
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
      customSnapshotIdentifier: "0.5x-80q",
    });
  });

  test("should work with false when target scale is <= 1", async () => {
    const compiler = getCompiler(webpackVersion, {
      scale: 0.5,
      scaleUp: false,
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
      customSnapshotIdentifier: "0.5x-80q",
    });
  });

  test("should work with true when target scale is > 1", async () => {
    const compiler = getCompiler(webpackVersion, {
      scale: 1.2,
      scaleUp: true,
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
      customSnapshotIdentifier: "1.2x-80q",
    });
  });

  test("should work with false when target scale is > 1", async () => {
    const compiler = getCompiler(webpackVersion, {
      scale: 2,
      scaleUp: false,
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
      customSnapshotIdentifier: "original-80q",
    });
  });
});
