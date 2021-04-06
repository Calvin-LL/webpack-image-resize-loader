const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        use: [
          "file-loader",
          {
            loader: "webpack-image-resize-loader",
            options: {
              width: 1000,
            },
          },
        ],
      },
      /*
      {
        // if you only want to resize some but not all images
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?resize..."
            resourceQuery: /resize/,
            use: [
              "file-loader",
              {
                loader: "webpack-image-resize-loader",
                options: {
                  width: 1000,
                },
              },
            ],
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
      */
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
