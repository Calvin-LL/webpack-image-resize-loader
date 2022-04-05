import webpack from "webpack";

import WIRLWebpackTestCompiler from "./helpers/WIRLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d validate options", (webpackVersion) => {
  const tests = {
    width: {
      success: [10],
      failure: [true, 0, 0.1],
    },
    height: {
      success: [10],
      failure: [true, 0, 0.1],
    },
    fit: {
      success: ["cover", "contain", "fill", "inside", "outside"],
      failure: [true, "0"],
    },
    position: {
      success: [
        "top",
        "right top",
        "right",
        "right bottom",
        "bottom",
        "left bottom",
        "left",
        "left top",

        "north",
        "northeast",
        "east",
        "southeast",
        "south",
        "southwest",
        "west",
        "northwest",
        "center",
        "centre",

        "entropy",
        "attention",
      ],
      failure: [true, "0"],
    },
    background: {
      success: ["#FFF", "rgb(2,4,99)", { r: 255, g: 255, b: 255 }],
      failure: [false, 9],
    },
    scale: {
      success: [0.1, 0.5, 1],
      failure: [-1, 0],
    },
    format: {
      success: ["jpeg", "png", "webp", "tiff", "gif"],
      failure: [true],
    },
    quality: {
      success: [10],
      failure: [0],
    },
    scaleUp: {
      success: [true, false],
      failure: [0],
    },
    sharpOptions: {
      success: [{ resize: { fastShrinkOnLoad: true } }],
      failure: [0],
    },
    fileLoader: {
      success: ["file-loader"],
      failure: [0],
    },
    fileLoaderOptionsGenerator: {
      success: [(_: any, o: any) => o, "(_, o) => o"],
      failure: [0],
    },
  };

  function createTestCase(
    key: string,
    value: any,
    type: "success" | "failure"
  ): void {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = new WIRLWebpackTestCompiler({ webpackVersion });

      let stats: webpack.Stats | undefined;

      try {
        stats = (
          await compiler.compile({
            loaderOptions: {
              width: 10,
              [key]: value,
            },
            throwOnError: false,
          })
        ).stats;
      } finally {
        if (type === "success") {
          expect(stats!.hasErrors()).toBe(false);
        } else if (type === "failure") {
          const errors = stats!.compilation.errors;

          expect(errors).toHaveLength(1);
          expect(errors[0].error.message).toMatchSnapshot();
        }
      }
    }, 60000);
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values) as ("success" | "failure")[]) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
