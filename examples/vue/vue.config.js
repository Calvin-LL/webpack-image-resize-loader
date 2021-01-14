const defaultFileLoaderOptionsGenerator = require("webpack-image-resize-loader/dist/index")
  .defaultFileLoaderOptionsGenerator;

module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images-resize")
      .test(/\.(png|jpe?g|webp|tiff?)$/i)
      .use("resize")
      .loader("webpack-image-resize-loader")
      .options({
        width: 1000,
        fileLoader: "url-loader",
        fileLoaderOptionsGenerator: (options, existingOptions) => ({
          ...existingOptions,
          fallback: {
            ...existingOptions.fallback,
            options: defaultFileLoaderOptionsGenerator(
              options,
              existingOptions.fallback.options
            ),
          },
        }),
      });

    /*
    // if you only want to resize some but not all images
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|webp|tiff?)$/i)
      // if the import url looks like "some.png?resize..."
      .oneOf("resize")
      .resourceQuery(/resize/)
      .use("resize")
      .loader("webpack-image-resize-loader")
      .options({
        width: 1000,
      })
      .end()
      .end()
      // if no previous resourceQuery match
      .oneOf("normal")
      .use("normal")
      .loader(config.module.rule("images").use("url-loader").get("loader"))
      .options(config.module.rule("images").use("url-loader").get("options"));
    */
  },
};
