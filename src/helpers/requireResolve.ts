// remove if https://github.com/facebook/jest/issues/9543 is closed
export default function requireResolve(
  id: string,
  options?: { paths?: Array<string> | undefined } | undefined
): string {
  return require.resolve(id, options);
}
