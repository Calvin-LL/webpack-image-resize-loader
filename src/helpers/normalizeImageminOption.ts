import type { ImageminOption } from "../index";

export default function normalizeImageminOption(
  option: ImageminOption | undefined
): { name: string; options?: Record<string, any> }[] | undefined {
  if (option === undefined || option === null) {
    return undefined;
  } else if (typeof option === "string") {
    return [{ name: option }];
  } else if (Array.isArray(option)) {
    return option.map((opt) => (typeof opt === "string" ? { name: opt } : opt));
  } else if (typeof option === "object") {
    return [option];
  }

  throw new Error("imageminOptions is invalid");
}
