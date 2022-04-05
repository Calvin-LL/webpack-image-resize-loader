import mime from "mime";

import type { Options } from "../index";

export default function getFormat(
  resourcePath: string
): Exclude<Options["format"], undefined> {
  const type = mime.getType(resourcePath);

  switch (type) {
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/tiff":
      return "tiff";
    case "image/gif":
      return "gif";
  }

  throw new Error(`unsupported image format ${resourcePath}`);
}
