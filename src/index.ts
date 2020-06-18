import path from "path";

import merge from "deepmerge";
import fileLoader from "file-loader";
import loaderUtils from "loader-utils";
import mime from "mime";
import replaceExt from "replace-ext";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import schema from "./options.json";

export interface SIZE {
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
}

export interface OPTIONS {
  size?: SIZE;
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
  const fullOptions = merge(queryObject ?? {}, options ?? {});

  if (fullOptions)
    validateOptions(schema as JSONSchema7, fullOptions, {
      name: "Image Resize Loader",
      baseDataPath: "options",
    });

  const size = fullOptions.size;
  const format = fullOptions.format ?? getFormat(this.resourcePath);
  const quality = fullOptions.quality;
  const scaleUp = fullOptions.scaleUp ?? false;
  const sharpOptions = fullOptions.sharpOptions;
  const fileLoaderOptions = fullOptions.fileLoaderOptions;

  processImage(content, { size, format, quality, scaleUp, sharpOptions })
    .then((result) => {
      const fileLoaderContext = {
        ...this,
        resourcePath: replaceExtension(this.resourcePath, format),
        query: fileLoaderOptions,
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
    size,
    format,
    quality,
    scaleUp,
    sharpOptions,
  }: Omit<Readonly<OPTIONS>, "esModule">
) {
  const sharpImage = sharp(Buffer.from(content));
  const {
    height: imageHeight,
    width: imageWidth,
  } = await sharpImage.metadata();
  const normalizedImageHeight = imageHeight ?? Number.MAX_VALUE;
  const normalizedImageWidth = imageWidth ?? Number.MAX_VALUE;
  const normalizedResultHeight = size?.height ?? 0;
  const normalizedResultWidth = size?.width ?? 0;

  let resultSharp = sharpImage;

  if (
    scaleUp ||
    (normalizedResultHeight <= normalizedImageHeight &&
      normalizedResultWidth <= normalizedImageWidth)
  )
    resultSharp = sharpImage.resize({
      ...size,
      ...sharpOptions?.resize,
    });

  if (format)
    resultSharp = resultSharp[format]({ quality, ...sharpOptions?.[format] });

  return await resultSharp.toBuffer();
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
