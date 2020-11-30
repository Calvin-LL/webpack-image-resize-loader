# webpack-image-resize-loader

[![npm](https://img.shields.io/npm/v/webpack-image-resize-loader?style=flat)](https://www.npmjs.com/package/webpack-image-resize-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader resize the given images to the desired size.

Supports JPEG, PNG, WebP, and, TIFF images.

## Examples

[React](https://github.com/Calvin-LL/webpack-image-resize-loader/tree/main/examples/react)

[Vue](https://github.com/Calvin-LL/webpack-image-resize-loader/tree/main/examples/vue)

[React example with other related loaders](https://github.com/Calvin-LL/react-responsive-images-example)

[Vue example with other related loaders](https://github.com/Calvin-LL/vue-responsive-images-example)

## Install

Install with npm:

```bash
npm install --save-dev webpack-image-resize-loader
```

Install with yarn:

```bash
yarn add --dev webpack-image-resize-loader
```

## Usage

Note: if you only want to shrink some but not all images use webpack's `oneOf` (like in the [examples](#examples)). If you want to use `srcset`, check out [webpack-image-srcset-loader](https://github.com/Calvin-LL/webpack-image-srcset-loader)

#### webpack.config.js

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        // make all imported images to have max width 1000px
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        use: [
          {
            loader: "webpack-image-resize-loader",
            options: {
              width: 1000,
            },
          },
        ],
      },
    ],
  },
};
```

#### You can override options with queries

```javascript
import placeholderUrl from "./some_pic.png?quality=100";
```

or

```javascript
import placeholderUrl from './some_pic.png?{"width":500}';
```

## Options

| Name                                          | Type                                                         | Default                                       | Description                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **[`width`](#width)**                         | `number`                                                     | `undefined`                                   | The width of the output image.                                                               |
| **[`height`](#height)**                       | `number`                                                     | `undefined`                                   | The height of the output image.                                                              |
| **[`scale`](#scale)**                         | `number`                                                     | `undefined`                                   | The fraction of the original size of the output image. `width` and `height` take precedence. |
| **[`scaleUp`](#scaleup)**                     | `boolean`                                                    | `false`                                       | Whether or not to scale up the image when the desired size is larger than the image size.    |
| **[`fit`](#fit)**                             | `"cover"`, `"contain"`, `"fill"`, `"inside"`, or `"outside"` | `"cover"`                                     | How the image should be resized to fit both provided dimensions.                             |
| **[`position`](#position)**                   | See **[`position`](#position)**                              | `"centre"`                                    | Where the image is positioned.                                                               |
| **[`background`](#background)**               | `string\|object`                                             | `{r:0,g:0,b:0,alpha:1}`                       | The background color of the image.                                                           |
| **[`format`](#format)**                       | `"jpeg"`, `"png"`, `"webp"`, or `"tiff"`                     | `undefined`                                   | The format of the output file.                                                               |
| **[`quality`](#quality)**                     | `number`                                                     | `80` for JPEG, WebP, and TIFF. `100` for PNG. | The quality of the output image.                                                             |
| **[`sharpOptions`](#sharpoptions)**           | `object`                                                     | `undefined`                                   | Additional options for [sharp](https://sharp.pixelplumbing.com).                             |
| **[`fileLoaderOptions`](#fileloaderoptions)** | `object`                                                     | `undefined`                                   | Additional options for [file-loader](https://github.com/webpack-contrib/file-loader).        |

### `width`

pixels wide the resultant image should be. Use `null` or `undefined` to auto-scale the width to match the height.

this is passed as `width` to the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `height`

pixels high the resultant image should be. Use null or undefined to auto-scale the height to match the width.

this is passed as `height` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `scale`

A number greater than `0`, `1` being the original size, `0.5` being half the size of the original image, `2` being twice the size of the original image.

If both this and `width` or `height` are set, `width` or `height` takes precedence.

### `scaleUp`

When true, images will be scaled up to a larger size. When false, if the desired size, either the `height` is greater than the height of the original image, the `width` is greater than the width of the original image, or `scale` is greater than 1, the size of the output image will be the same as the imported image.

### `fit`

this is passed as `fit` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `position`

type: `"top"`, `"right top"`, `"right"`, `"right bottom"`, `"bottom"`, `"left bottom"`, `"left"`, `"left top"`, `"north"`, `"northeast"`, `"east"`, `"southeast"`, `"south"`, `"southwest"`, `"west"`, `"northwest"`, `"center"`, `"centre"`, `"entropy"`, or `"attention"`

position, gravity or strategy to use when `fit` is `cover` or `contain`.

- `sharp.position`: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`.
- `sharp.gravity`: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
- `sharp.strategy`: `cover` only, dynamically crop using either the `entropy` or `attention` strategy.

this is passed as `position` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `background`

example: `"#7743CE"`, `"rgb(255, 255, 255)"`, `{r:0,g:0,b:0,alpha:1}`

background colour when using a `fit` of `contain`, parsed by the [color](https://www.npmjs.com/package/color) module, defaults to black without transparency.

this is passed as `background` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `format`

When unspecified, outputs the same format as the imported file.

### `quality`

From 1-100, 1 being most compression and worst quality, 100 being least compression and best quality.

This is passed as `quality` in the [the parameters of sharp's png, jpeg, webp, and png function](https://sharp.pixelplumbing.com/api-output)

### `sharpOptions`

sharpOptions can have any of the following keys: `resize`, `png`, `jpeg`, `webp`, and `tiff`. These options will override options specified above.

as in

```javascript
{
  resize: {}, // these are passed as the options object in https://sharp.pixelplumbing.com/api-resize#parameters
  png: {}, // these are passed as the options object in https://sharp.pixelplumbing.com/api-output#png
  jpeg: {}, // these are passed as the options object in https://sharp.pixelplumbing.com/api-output#jpeg
  webp: {}, // these are passed as the options object in https://sharp.pixelplumbing.com/api-output#webp
  tiff: {}, // these are passed as the options object in https://sharp.pixelplumbing.com/api-output#tiff
}
```

### `fileLoaderOptions`

fileLoaderOptions is passed as the options object internally to [file-loader](https://github.com/webpack-contrib/file-loader) to save a file. Go to [file-loader](https://github.com/webpack-contrib/file-loader) to find the available options.
