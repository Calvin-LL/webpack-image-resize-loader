import fileLoader from "file-loader";
import imagemin from "imagemin";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import getFormat from "./helpers/getFormat";
import getImageminPlugins from "./helpers/getImageminPlugins";
import normalizeImageminOption from "./helpers/normalizeImageminOption";
import replaceExtension from "./helpers/replaceExtension";
import schema from "./options.json";

export type ImageminOption =
  | null
  | string
  | { name: string; options?: Record<string, any> }
  | (string | { name: string; options?: Record<string, any> })[];

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
  readonly imageminOptions?: {
    readonly png?: ImageminOption;
    readonly jpeg?: ImageminOption;
    readonly webp?: ImageminOption;
    readonly tiff?: ImageminOption;
  };
  readonly fileLoaderOptions?: Partial<fileLoader.Options>;
}

export type FullOptions = Options &
  Required<
    Pick<Options, "scaleUp" | "format" | "sharpOptions" | "imageminOptions">
  >;

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
    sharpOptions: {
      png: { quality: 100 },
      jpeg: { quality: 100 },
      webp: { quality: 100 },
      tiff: { quality: 100 },
    },
    imageminOptions: {
      png: {
        name: "imagemin-optipng",
        options: { interlaced: true, optimizationLevel: 7 },
      },
      jpeg: {
        name: "imagemin-mozjpeg",
        options: { quality: 80 },
      },
      webp: {
        name: "imagemin-webp",
        options: { quality: 75 },
      },
    },
  };
  const rawOptions = getOptions<Options>(this, true, true);
  const options: FullOptions = {
    ...defaultOptions,
    sharpOptions: {
      ...defaultOptions.sharpOptions,
      ...rawOptions.sharpOptions,
    },
    imageminOptions: {
      ...defaultOptions.imageminOptions,
      ...rawOptions.imageminOptions,
    },
    ...rawOptions,
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
    imageminOptions,
  }: FullOptions
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

  sharpImage = sharpImage[format]({
    ...sharpOptions?.[format],
  });

  const normalizedImageminOptions = normalizeImageminOption(
    imageminOptions?.[format]
  );
  const imageminPlugins = getImageminPlugins(normalizedImageminOptions, {
    ...(quality ? { quality } : {}),
  });
  const sharpImageOutput = await sharpImage.toBuffer();

  if (imageminPlugins === undefined) return sharpImageOutput;

  const imageminOutput = await imagemin.buffer(sharpImageOutput, {
    plugins: imageminPlugins,
  });

  return imageminOutput;
}
