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

    config.module.rule("images").uses.delete("url-loader");
  },
};
