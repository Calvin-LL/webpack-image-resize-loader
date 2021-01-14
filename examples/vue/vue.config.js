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
        // this is needed for this example because "webpack-image-resize-loader" is not in ./node_modules
        // if you're copying this code, you most likely won't need this
        fileLoader: require.resolve("url-loader"),
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
        // this is needed for this example because "webpack-image-resize-loader" is not in ./node_modules
        // if you're copying this code, you most likely won't need this
        fileLoader: require.resolve("url-loader"),
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
      */
  },
};
