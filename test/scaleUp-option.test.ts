import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"scaleUp" option', () => {
  it("should work with true when target width is small", async () => {
    const compiler = getCompiler({
      width: 10,
      scaleUp: true,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with false when target width is small", async () => {
    const compiler = getCompiler({
      width: 10,
      scaleUp: false,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with true when target width is large", async () => {
    const compiler = getCompiler({
      width: 3000,
      scaleUp: true,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with false when target width is large", async () => {
    const compiler = getCompiler({
      width: 3000,
      scaleUp: false,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
