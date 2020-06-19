import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"quality" option', () => {
  it("should work with 80", async () => {
    const compiler = getCompiler({
      width: 10,
      quality: 80,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with 1", async () => {
    const compiler = getCompiler({
      width: 10,
      quality: 1,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
