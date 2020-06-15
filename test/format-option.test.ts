import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"format" option', () => {
  it("should work with jpeg", async () => {
    const compiler = getCompiler({
      size: {
        width: 10,
      },
      format: "jpeg",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with png", async () => {
    const compiler = getCompiler({
      size: {
        width: 10,
      },
      format: "png",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with webp", async () => {
    const compiler = getCompiler({
      size: {
        width: 10,
      },
      format: "webp",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with tiff", async () => {
    const compiler = getCompiler({
      size: {
        width: 10,
      },
      format: "tiff",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
