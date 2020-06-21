import sharp from "sharp";

export default async function (jpegBuffer: Buffer) {
  return await sharp(jpegBuffer).png().toBuffer();
}
