import path from "path";

import fileLoader from "file-loader";
import loaderUtils from "loader-utils";
import mime from "mime";
import replaceExt from "replace-ext";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import schema from "./options.json";

export interface OPTIONS {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  position?:
    | "top"
    | "right top"
    | "right"
    | "right bottom"
    | "bottom"
    | "left bottom"
    | "left"
    | "left top"
    | "north"
    | "northeast"
    | "east"
    | "southeast"
    | "south"
    | "southwest"
    | "west"
    | "northwest"
    | "center"
    | "centre"
    | "entropy"
    | "attention";
  background?: string | object;
  scale?: number;
  format?: "jpeg" | "png" | "webp" | "tiff";
  quality?: number;
  scaleUp?: boolean;
  sharpOptions?: {
    resize?: object;
    png?: object;
    jpeg?: object;
    webp?: object;
    tiff?: object;
  };
  fileLoaderOptions?: object;
}

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer,
  sourceMap?: RawSourceMap
) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as Readonly<OPTIONS> | null;
  const queryObject = this.resourceQuery
    ? (loaderUtils.parseQuery(this.resourceQuery) as Partial<OPTIONS>)
    : undefined;
  const fullOptions = { ...options, ...queryObject };

  validate(schema as Schema, fullOptions, {
    name: "Image Resize Loader",
    baseDataPath: "options",
  });

  const fullOptionsWithDefaults = {
    format: getFormat(this.resourcePath),
    scaleUp: false,
    ...fullOptions,
  };

  processImage(content, fullOptionsWithDefaults)
    .then((result) => {
      const fileLoaderContext = {
        ...this,
        resourcePath: replaceExtension(
          this.resourcePath,
          fullOptionsWithDefaults.format
        ),
        query: fullOptionsWithDefaults.fileLoaderOptions,
      };
      const fileLoaderResult = fileLoader.call(
        fileLoaderContext,
        result,
        sourceMap
      );
      callback?.(null, fileLoaderResult);
    })
    .catch((e) => {
      throw e;
    });
}

async function processImage(
  content: ArrayBuffer,
  {
    width,
    height,
    fit,
    position,
    background,
    scale,
    format,
    quality,
    scaleUp,
    sharpOptions,
  }: Readonly<OPTIONS>
) {
  let sharpImage = sharp(Buffer.from(content));
  const {
    height: imageHeight,
    width: imageWidth,
  } = await sharpImage.metadata();
  const normalizedImageHeight = imageHeight ?? Number.MAX_VALUE;
  const normalizedImageWidth = imageWidth ?? Number.MAX_VALUE;
  const normalizedResultHeight = height ?? 0;
  const normalizedResultWidth = width ?? 0;

  if (
    (width || height) &&
    (scaleUp ||
      (normalizedResultHeight <= normalizedImageHeight &&
        normalizedResultWidth <= normalizedImageWidth))
  )
    sharpImage = sharpImage.resize({
      width,
      height,
      fit,
      position,
      background,
      ...sharpOptions?.resize,
    });
  else if (scale && (scaleUp || scale <= 1)) {
    sharpImage = sharpImage.resize({
      width: Math.round(normalizedImageWidth * scale),
      fit,
      position,
      background,
      ...sharpOptions?.resize,
    });
  }

  if (format)
    sharpImage = sharpImage[format]({ quality, ...sharpOptions?.[format] });

  return await sharpImage.toBuffer();
}

function replaceExtension(resourcePath: string, format: string | undefined) {
  if (!format) return resourcePath;
  if (mime.getType(format) === mime.getType(path.extname(resourcePath)))
    return resourcePath;

  return replaceExt(resourcePath, `.${format}`);
}

function getFormat(resourcePath: string): OPTIONS["format"] | undefined {
  const type = mime.getType(resourcePath);

  switch (type) {
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/tiff":
      return "tiff";
  }
}
