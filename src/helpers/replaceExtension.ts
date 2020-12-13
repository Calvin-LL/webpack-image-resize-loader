import mime from "mime";
import path from "path";
import replaceExt from "replace-ext";

export default function replaceExtension(
  resourcePath: string,
  format: string | undefined
): string {
  if (!format) return resourcePath;
  if (mime.getType(format) === mime.getType(path.extname(resourcePath)))
    return resourcePath;

  return replaceExt(resourcePath, `.${format}`);
}
