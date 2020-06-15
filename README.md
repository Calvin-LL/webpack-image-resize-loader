# webpack-image-resize-loader [![npm](https://img.shields.io/npm/v/webpack-image-resize-loader)](https://www.npmjs.com/package/webpack-image-resize-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader generates a color or solid color image from a given image for use as a placeholder.

Under the hood this package uses [fast-average-color](https://github.com/fast-average-color/fast-average-color). See [fast-average-color](https://github.com/fast-average-color/fast-average-color) for examples of colors derived from images.

Supports JPEG, PNG, WebP, TIFF, GIF and SVG images.

## Install

Install with npm:

```bash
npm install --save-dev webpack-image-resize-loader
```

Install with yarn:

```bash
yarn add webpack-image-resize-loader --dev
```

## Usage

### Recommanded usage for Webpack v4

#### Step 1

##### Install [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader)

Install with npm:

```bash
npm install --save-dev webpack-query-loader
```

Install with yarn:

```bash
yarn add webpack-query-loader --dev
```

#### Step 2

##### Configure [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader)

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)/i,
        use: [
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "placeholder",
              use: {
                loader: "webpack-image-resize-loader",
                options: {
                  format: "base64",
                  size: 1,
                  color: "sqrt",
                  backgroundColor: "#FFF"
                }
              }
            },
          },
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "!placeholder",
              use: {
                loader: "file-loader", // or whatever loaders you want to use
              }
            },
          },
        ],
      },
    ],
  },
};

```

#### Step 3

##### Use in code

```javascript
import placeholderUrl from "./some_pic.png?placeholder";
```

To override options for one import, you can use queries

```javascript
import placeholderUrl from "./some_pic.png?placeholder&size=original";
```

### Other usage for Webpack v4

With default options:

```javascript
import placeholderUrl from "!!webpack-image-resize-loader!./some_pic.png";
```

With specified options:

```javascript
import placeholderUrl from "!!webpack-image-resize-loader!./some_pic.png?format=base64&size=1&color=sqrt&backgroundColor=white";
```

### Recommanded usage for Webpack v5

Just use resourceQuery

## Options

|                   Name                    |                 Type                 |  Default   |                                                                                                                       Description                                                                                                                        |
| :---------------------------------------: | :----------------------------------: | :--------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|          **[`format`](#format)**          | `"base64", "hex", "rgb", or "array"` | `"base64"` |                                                                                                                 The format of the output                                                                                                                 |
|            **[`size`](#size)**            |        `number or "original"`        |    `1`     |                                                                             The size of the output image if `format` is `"base64"`, no effect if the format is anything else                                                                             |
|           **[`color`](#color)**           |          `{string\|object}`          |  `"sqrt"`  | An [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md) ("simple", "sqrt" or "dominant") to generate a color from a given image, or a color string or color object to use in generating the output image |
| **[`backgroundColor`](#backgroundColor)** |          `{string\|object}`          |  `"#FFF"`  |                                                                                             The background color to use if the given image has transparency                                                                                              |
|        **[`esModule`](#esModule)**        |              `boolean`               |   `true`   |                                                                                          Whether the export is in ES modules syntax or CommonJS modules syntax                                                                                           |

### `format`

With

```javascript
import placeholderUrl from "./some_pic.png?placeholder";
```

- `format: "base64"`: `placeholderUrl === "data:image/png;base64,iVBORw0KG..."`
- `format: "hex"`: `placeholderUrl === "#6b7548"`
- `format: "rgb"`: `placeholderUrl === "rgb(107, 117, 72)"`
- `format: "array"`: `placeholderUrl === [107, 117, 72]"`

### `size`

`size` will only take effect if `format: "base64"`. When `size` is a number, the output image will be a square of the given number of pixels. When `size: "original"`, the output image will be the size of the original image.

### `color`

`color` can be an [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md) ("simple", "sqrt" or "dominant") to generate a color from a given image (see examples in [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md)), or a color string or color object to use in generating the output image.

A color string or color object is any valid colors accepted by [TinyColor](https://github.com/bgrins/TinyColor).

For example:

```javascript
{
  color: "white",
  format: "base64"
}
```

will output a white pixel.

```javascript
{
  color: "white",
  format: "hex"
}
```

will output `#FFFFFF`

### `backgroundColor`

If an image has transparency, `backgroundColor` will be used as the background color. By default `backgroundColor` is white.

### `esModule`

Whether the export is in ES modules syntax or CommonJS modules syntax. If you don't know what it is or whether or not you need it, leave is as default.
