import fileLoader from "file-loader";
import mime from "mime";
import path from "path";
import replaceExt from "replace-ext";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import schema from "./options.json";

export interface Options {
  readonly width?: number;
  readonly height?: number;
  readonly fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  readonly position?:
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
  readonly background?: sharp.Color;
  readonly scale?: number;
  readonly format?: "jpeg" | "png" | "webp" | "tiff";
  readonly quality?: number;
  readonly scaleUp?: boolean;
  readonly sharpOptions?: {
    readonly resize?: Partial<sharp.ResizeOptions>;
    readonly png?: Partial<sharp.PngOptions>;
    readonly jpeg?: Partial<sharp.JpegOptions>;
    readonly webp?: Partial<sharp.WebpOptions>;
    readonly tiff?: Partial<sharp.TiffOptions>;
  };
  readonly fileLoaderOptions?: Partial<fileLoader.Options>;
}

export type FullOptions = Options & Required<Pick<Options, "scaleUp">>;

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer,
  sourceMap?: RawSourceMap
): void {
  const callback = this.async() as loader.loaderCallback;
  const defaultOptions: FullOptions = {
    format: getFormat(this.resourcePath),
    scaleUp: false,
  };
  const options: Options = {
    ...defaultOptions,
    ...getOptions<Options>(this, true, true),
  };

  validate(schema as Schema, options, {
    name: "Image Resize Loader",
    baseDataPath: "options",
  });

  processImage(content, options)
    .then((result) => {
      const fileLoaderContext = {
        ...this,
        resourcePath: replaceExtension(this.resourcePath, options.format),
        query: options.fileLoaderOptions,
      };
      const fileLoaderResult = fileLoader.call(
        fileLoaderContext,
        result,
        sourceMap
      );
      callback(null, fileLoaderResult);
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
  }: Options
): Promise<Buffer> {
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

function replaceExtension(
  resourcePath: string,
  format: string | undefined
): string {
  if (!format) return resourcePath;
  if (mime.getType(format) === mime.getType(path.extname(resourcePath)))
    return resourcePath;

  return replaceExt(resourcePath, `.${format}`);
}

function getFormat(resourcePath: string): Options["format"] {
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
