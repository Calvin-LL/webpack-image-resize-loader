import getFormat from "../../src/helpers/getFormat";

it("should parse png format", () => {
  expect(getFormat("image.png")).toBe("png");
  expect(getFormat("image.PNG")).toBe("png");
});

it("should parse jpeg format", () => {
  expect(getFormat("image.JPG")).toBe("jpeg");
  expect(getFormat("image.JPEG")).toBe("jpeg");
  expect(getFormat("image.jpg")).toBe("jpeg");
  expect(getFormat("image.jpeg")).toBe("jpeg");
});

it("should parse webp format", () => {
  expect(getFormat("image.webp")).toBe("webp");
  expect(getFormat("image.WEBP")).toBe("webp");
});

it("should parse avif format", () => {
  expect(getFormat("image.avif")).toBe("avif");
  expect(getFormat("image.AVIF")).toBe("avif");
});

it("should parse webp format", () => {
  expect(getFormat("image.tiff")).toBe("tiff");
  expect(getFormat("image.tif")).toBe("tiff");
  expect(getFormat("image.TIFF")).toBe("tiff");
  expect(getFormat("image.TIF")).toBe("tiff");
});

it("should throw when image is not recognized", () => {
  expect(() => getFormat("image.app")).toThrow();
});
