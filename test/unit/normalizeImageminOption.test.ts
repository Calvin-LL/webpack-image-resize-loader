import normalizeImageminOption from "../../src/helpers/normalizeImageminOption";

it("should normalize undefined", () => {
  expect(normalizeImageminOption(undefined)).toBe(undefined);
});

it('should normalize "imagemin-optipng"', () => {
  expect(normalizeImageminOption("imagemin-optipng")).toMatchObject([
    {
      name: "imagemin-optipng",
    },
  ]);
});

it('should normalize ["imagemin-optipng"]', () => {
  expect(normalizeImageminOption(["imagemin-optipng"])).toMatchObject([
    {
      name: "imagemin-optipng",
    },
  ]);
});

it('should normalize [{ name: "imagemin-optipng", options: { test: true } }]', () => {
  expect(
    normalizeImageminOption({
      name: "imagemin-optipng",
      options: { test: true },
    })
  ).toMatchObject([{ name: "imagemin-optipng", options: { test: true } }]);
});

it('should normalize [{ name: "imagemin-optipng", options: { test: true } }]', () => {
  expect(
    normalizeImageminOption([
      { name: "imagemin-optipng", options: { test: true } },
    ])
  ).toMatchObject([{ name: "imagemin-optipng", options: { test: true } }]);
});
