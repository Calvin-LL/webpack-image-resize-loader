export default function getImageminPlugins(
  options: { name: string; options?: Record<string, any> }[] | undefined,
  optionsOverride?: Record<string, any>
): ((input: Buffer) => Promise<Buffer>)[] | undefined {
  if (options === undefined) return undefined;

  return options.map(({ name, options }) =>
    require(name)({ ...options, ...optionsOverride })
  );
}
