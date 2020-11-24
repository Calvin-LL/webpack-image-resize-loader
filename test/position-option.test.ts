import { toMatchImageSnapshot } from "jest-image-snapshot";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)('v%d "position" option', (webpackVersion) => {
  test("should work with right", async () => {
    const compiler = new WIRLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        width: 10,
        height: 10,
        fit: "contain",
        position: "right",
        fileLoaderOptions: {
          name: "image.jpg",
        },
      },
    });

    expect(await bundle.readAssetAsPNG("image.jpg")).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0 },
      customSnapshotIdentifier: "10w-10h-80q-contain-right",
    });
  });
});
