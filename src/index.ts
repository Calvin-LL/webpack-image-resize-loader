import fileLoader from "file-loader";
import { parseQuery } from "loader-utils";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import getFormat from "./helpers/getFormat";
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
  readonly format?: "jpeg" | "png" | "webp" | "avif" | "tiff" | "gif";
  readonly quality?: number;
  readonly scaleUp?: boolean;
  readonly sharpOptions?: {
    readonly resize?: Partial<sharp.ResizeOptions>;
    readonly png?: Partial<sharp.PngOptions>;
    readonly jpeg?: Partial<sharp.JpegOptions>;
    readonly webp?: Partial<sharp.WebpOptions>;
    readonly avif?: Partial<sharp.AvifOptions>;
    readonly tiff?: Partial<sharp.TiffOptions>;
    readonly gif?: Partial<sharp.GifOptions>;
  };
  readonly fileLoader?: string;
  readonly fileLoaderOptionsGenerator?:
    | string
    | ((
        options: Omit<FullOptions, "optionsGenerator">,
        existingOptions: Record<string, any> | undefined
      ) => Record<string, any>);
}

export type FullOptions = Options &
  Required<
    Pick<
      Options,
      | "scaleUp"
      | "format"
      | "sharpOptions"
      | "fileLoader"
      | "fileLoaderOptionsGenerator"
    >
  >;

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer
): void {
  const callback = this.async() as loader.loaderCallback;
  const defaultOptions: FullOptions = {
    format: getFormat(this.resourcePath),
    scaleUp: false,
    sharpOptions: {
      png: { compressionLevel: 9, adaptiveFiltering: true },
      jpeg: { mozjpeg: true },
      webp: { reductionEffort: 6 },
      avif: { speed: 0 },
    },
    fileLoader: "file-loader",
    fileLoaderOptionsGenerator: defaultFileLoaderOptionsGenerator,
  };
  const rawOptions = getOptions<Options>(this, true, true);
  const options: FullOptions = {
    ...defaultOptions,
    sharpOptions: {
      ...defaultOptions.sharpOptions,
      ...rawOptions.sharpOptions,
    },
    ...rawOptions,
  };

  validate(schema as Schema, options, {
    name: "Image Resize Loader",
    baseDataPath: "options",
  });

  processImage(content, options)
    .then((result) =>
      replaceFileLoaderOptions(this, options, rawOptions).then(() => {
        callback(null, result);
      })
    )
    .catch((error) => {
      callback(error, undefined);
    });
}

export function defaultFileLoaderOptionsGenerator(
  { format }: Omit<FullOptions, "optionsGenerator">,
  existingOptions: fileLoader.Options | undefined
): fileLoader.Options {
  let name = existingOptions?.name;

  if (name === undefined) {
    name = `[contenthash].${format}`;
  } else if (typeof name === "string") {
    name = name.replace("[ext]", format);
  } else if (typeof name === "function") {
    name = (file: string) => {
      const nameFn = existingOptions!.name as (file: string) => string;

      return nameFn(file).replace("[ext]", format);
    };
  }

  return {
    ...existingOptions,
    name,
  };
}

function resolveLoader(
  context: loader.LoaderContext,
  path: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // get internal `enhanced-resolve` resolver
    const resolver = context._compilation.resolverFactory.get("loader");

    resolver.resolve(
      {},
      context.rootContext,
      path,
      {},
      (err: null | Error, resolvedResource: string) => {
        if (err) reject(err);
        else resolve(resolvedResource);
      }
    );
  });
}

async function replaceFileLoaderOptions(
  context: loader.LoaderContext,
  options: FullOptions,
  rawOptions: Options
): Promise<void> {
  const { fileLoader: fileLoaderName, fileLoaderOptionsGenerator } = options;
  const loaders = context.loaders as {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[];

  let fileLoaderNameOrPath = fileLoaderName;
  // try to resolve path, if path not found, try to find by
  // fileLoaderName directly
  try {
    fileLoaderNameOrPath = await resolveLoader(context, fileLoaderNameOrPath);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const fileLoader = loaders.find(
    ({ path }, index) =>
      index < context.loaderIndex && path === fileLoaderNameOrPath
  );

  if (fileLoader === undefined) {
    if (
      rawOptions.fileLoader !== undefined ||
      rawOptions.fileLoaderOptionsGenerator !== undefined
    ) {
      // only throw when either fileLoader or fileLoaderOptionsGenerator is set
      // don't want to throw if using url-loader for example
      throw new Error(
        `Can't find "${fileLoaderName}" in the list of loaders before webpack-image-resize-loader`
      );
    } else {
      return;
    }
  }

  const fileLoaderOptions =
    typeof fileLoader.options === "string"
      ? parseQuery("?" + fileLoader.options)
      : fileLoader.options;

  if (typeof fileLoaderOptionsGenerator === "string")
    fileLoader.options = eval(fileLoaderOptionsGenerator)(
      options,
      fileLoaderOptions
    );
  else
    fileLoader.options = fileLoaderOptionsGenerator(options, fileLoaderOptions);
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
  }: FullOptions
): Promise<Buffer> {
  let sharpImage = sharp(Buffer.from(content));
  const { height: imageHeight, width: imageWidth } =
    await sharpImage.metadata();
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
    ...(quality ? { quality } : {}),
    ...sharpOptions?.[format],
  });

  const sharpImageOutput = await sharpImage.toBuffer();

  return sharpImageOutput;
}
