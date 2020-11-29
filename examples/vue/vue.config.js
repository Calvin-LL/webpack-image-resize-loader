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
        format: "webp",
        quality: 80,
      });

    config.module.rule("images").uses.delete("url-loader");
  },
};
