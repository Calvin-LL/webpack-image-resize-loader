# webpack-image-resize-loader

[![npm](https://img.shields.io/npm/v/webpack-image-resize-loader)](https://www.npmjs.com/package/webpack-image-resize-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader resize the given images to the desired size.

Supports JPEG, PNG, WebP, and, TIFF images.

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

Note: if you only want to shrink some but not all images, check out [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader) or use webpack's `resourceQuery`. If you want to use `srcset`, check out [webpack-image-srcset-loader](https://github.com/CoolCyberBrain/webpack-image-srcset-loader)

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|tiff?)/i,
        use: [
          {
            loader: "webpack-image-resize-loader",
            options: {
              size: {
                width: 1000,
              },
              format: "webp",
              quality: 80,
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
import placeholderUrl from "./some_pic.png?{size:{width:500}}";
```

or

```javascript
import placeholderUrl from "./some_pic.png?quality=100";
```

## Options

| Name                                          | Type                                     | Default                                       | Description                                                                               |
| --------------------------------------------- | ---------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **[`size`](#size)**                           | `object`                                 | `undefined`                                   | The size of the output image.                                                             |
| **[`format`](#format)**                       | `"jpeg"`, `"png"`, `"webp"`, or `"tiff"` | `undefined`                                   | The format of the output file.                                                            |
| **[`scaleUp`](#scaleUp)**                     | `boolean`                                | `false`                                       | Whether or not to scale up the image when the desired size is larger than the image size. |
| **[`quality`](#quality)**                     | `number`                                 | `80` for JPEG, WebP, and TIFF. `100` for PNG. | The quality of the output image.                                                          |
| **[`sharpOptions`](#sharpOptions)**           | `object`                                 | `undefined`                                   | Additional options for [sharp](https://sharp.pixelplumbing.com).                          |
| **[`fileLoaderOptions`](#fileLoaderOptions)** | `object`                                 | `undefined`                                   | Additional options for [file-loader](https://github.com/webpack-contrib/file-loader).     |

### `size`

This field is required.

#### `width`

type: `number`

default: `undefined`

pixels wide the resultant image should be. Use `null` or `undefined` to auto-scale the width to match the height.

this is passed as `width` to the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

#### `height`

type: `number`

default: `undefined`

pixels high the resultant image should be. Use null or undefined to auto-scale the height to match the width.

this is passed as `height` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

#### `fit`

type: `"cover"`, `"contain"`, `"fill"`, `"inside"`, or `"outside"`

default: `"cover"`

how the image should be resized to fit both provided dimensions.

this is passed as `fit` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

#### `position`

type: `"north"`, `"northeast"`, `"east"`, `"southeast"`, `"south"`, `"southwest"`, `"west"`, `"northwest"`, `"center"`, `"centre"`, `"entropy"`, or `"attention"`

default: `"centre"`

position, gravity or strategy to use when `fit` is `cover` or `contain`.

- `sharp.position`: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`.
- `sharp.gravity`: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
- `sharp.strategy`: `cover` only, dynamically crop using either the `entropy` or `attention` strategy.

this is passed as `position` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

#### `background`

type: `{string\|object}`

default: `{r:0,g:0,b:0,alpha:1}`

example: `"#7743CE"`, `"rgb(255, 255, 255)"`, `{r:0,g:0,b:0,alpha:1}`

background colour when using a `fit` of `contain`, parsed by the [color](https://www.npmjs.com/package/color) module, defaults to black without transparency.

this is passed as `background` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `format`

When unspecified, outputs the same format as the imported file.

### `scaleUp`

When true, images will be scaled up to a larger size. When false, if the desired size, either the desired height is greater than the height of the original image, or the desired width is greater than the width of the original image, the size of the output image will be the same as the imported image.

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
