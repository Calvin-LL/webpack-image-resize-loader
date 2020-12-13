import replaceExtension from "../../src/helpers/replaceExtension";

it("should change the path to the format", () => {
  expect(replaceExtension("image.png", "jpeg")).toBe("image.jpeg");
});

it("should leave the path alone if given the same format", () => {
  expect(replaceExtension("image.png", "png")).toBe("image.png");
});
