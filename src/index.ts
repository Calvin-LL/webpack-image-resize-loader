import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import sharp from "sharp";
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
    | "left top";
  background?: string | object;
}

export interface OPTIONS {
  size: SIZE;
  format?: "jpeg" | "png" | "webp" | "tiff";
  quality?: number;
  scaleUp?: boolean;
  esModule?: boolean;
  sharpOptions?: {
    resize?: object;
    png?: object;
    jpeg?: object;
    webp?: object;
    tiff?: object;
  };
}

export const raw = true;

export default function (this: loader.LoaderContext, content: ArrayBuffer) {
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

  const size = data?.size ?? params?.size ?? options?.size;
  const format = data?.format ?? params?.format ?? options?.format;
  const quality = data?.quality ?? params?.quality ?? options?.quality ?? 80;
  const scaleUp = data?.scaleUp ?? params?.scaleUp ?? options?.scaleUp ?? false;
  const sharpOptions = data?.esModule ?? params?.esModule ?? options?.esModule;

  processImage(content, { size, format, quality, scaleUp, sharpOptions })
    .then((result) => {
      callback?.(null, result);
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
