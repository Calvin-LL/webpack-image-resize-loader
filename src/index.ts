import path from "path";

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
  size: SIZE;
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
  const params = this.resourceQuery
    ? (loaderUtils.parseQuery(this.resourceQuery) as Partial<OPTIONS>)
    : undefined;
  const data = this.data;

  if (options)
    validateOptions(schema as JSONSchema7, options, {
      name: "Image Placeholder Loader",
      baseDataPath: "options",
    });

  const size =
    (data?.["webpack-image-resize-loader"]?.size as OPTIONS["size"]) ??
    params?.size ??
    options?.size;
  const format =
    (data?.["webpack-image-resize-loader"]?.format as OPTIONS["format"]) ??
    params?.format ??
    options?.format;
  const quality =
    (data?.["webpack-image-resize-loader"]?.quality as OPTIONS["quality"]) ??
    params?.quality ??
    options?.quality;
  const scaleUp =
    (data?.["webpack-image-resize-loader"]?.scaleUp as OPTIONS["scaleUp"]) ??
    params?.scaleUp ??
    options?.scaleUp ??
    false;
  const sharpOptions =
    (data?.["webpack-image-resize-loader"]
      ?.sharpOptions as OPTIONS["sharpOptions"]) ??
    params?.sharpOptions ??
    options?.sharpOptions;
  const fileLoaderOptions =
    (data?.["webpack-image-resize-loader"]
      ?.fileLoaderOptions as OPTIONS["fileLoaderOptions"]) ??
    params?.fileLoaderOptions ??
    options?.fileLoaderOptions;

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
