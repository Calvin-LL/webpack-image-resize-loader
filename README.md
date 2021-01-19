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

You must place `file-loader` or `url-loader` or some other loader capable of handing buffers before `webpack-image-resize-loader`

Use [`webpack-sharp-loader`](https://github.com/Calvin-LL/webpack-sharp-loader) if you want to do other processing to your image before resizing

#### webpack.config.js

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        // convert all imported images to have max width 1000px
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
    ],
  },
};
```

#### You can override options with queries

```javascript
import image from "./some_pic.png?format=webp";
```

or

```javascript
// or any other options
import image from "./some_pic.png?width=100&height=100&quality=100&background=green&fit=contain&position=left";
```

or

```javascript
// or any other options
import image from './some_pic.png?{"width":500}';
```

## Options

| Name                                                            | Type                                                         | Default                                       | Description                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **[`width`](#width)**                                           | `number`                                                     | `undefined`                                   | The width of the output image.                                                               |
| **[`height`](#height)**                                         | `number`                                                     | `undefined`                                   | The height of the output image.                                                              |
| **[`scale`](#scale)**                                           | `number`                                                     | `undefined`                                   | The fraction of the original size of the output image. `width` and `height` take precedence. |
| **[`scaleUp`](#scaleup)**                                       | `boolean`                                                    | `false`                                       | Whether or not to scale up the image when the desired size is larger than the image size.    |
| **[`fit`](#fit)**                                               | `"cover"`, `"contain"`, `"fill"`, `"inside"`, or `"outside"` | `"cover"`                                     | How the image should be resized to fit both provided dimensions.                             |
| **[`position`](#position)**                                     | See **[`position`](#position)**                              | `"centre"`                                    | Where the image is positioned.                                                               |
| **[`background`](#background)**                                 | `string\|object`                                             | `{r:0,g:0,b:0,alpha:1}`                       | The background color of the image.                                                           |
| **[`format`](#format)**                                         | `"jpeg"`, `"png"`, `"webp"`, or `"tiff"`                     | `undefined`                                   | The format of the output file.                                                               |
| **[`quality`](#quality)**                                       | `number`                                                     | `80` for JPEG, WebP, and TIFF. `100` for PNG. | The quality of the output image.                                                             |
| **[`sharpOptions`](#sharpoptions)**                             | `object`                                                     | [see below](#sharpoptions)                    | Additional options for [sharp](https://sharp.pixelplumbing.com).                             |
| **[`imageminOptions`](#imageminoptions)**                       | `string\|object\|array`                                      | [see below](#imageminoptions)                 | Additional options for [imagemin](https://github.com/imagemin/imagemin).                     |
| **[`fileLoader`](#fileloader)**                                 | `string`                                                     | `"file-loader"`                               | Name or path of a loader that takes in buffers. ([why?](#fileloader))                        |
| **[`fileLoaderOptionsGenerator`](#fileloaderoptionsgenerator)** | `function`                                                   | [see below](#fileloaderoptionsgenerator)      | A function that generates options for the specified `fileLoader`.                            |

### `width`

Pixels width the resultant image should be. Use `null` or `undefined` to auto-scale the width to match the height.

This is passed as `width` to the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `height`

Pixels height the resultant image should be. Use null or undefined to auto-scale the height to match the width.

This is passed as `height` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `scale`

A number greater than `0`, `1` being the original size, `0.5` being half the size of the original image, `2` being twice the size of the original image.

If both this and `width` or `height` are set, `width` or `height` takes precedence.

### `scaleUp`

When true, images will be scaled up to a larger size. When false, if the desired size, either the `height` is greater than the height of the original image, the `width` is greater than the width of the original image, or `scale` is greater than 1, the size of the output image will be the same as the imported image.

### `fit`

This is passed as `fit` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `position`

type: `"top"`, `"right top"`, `"right"`, `"right bottom"`, `"bottom"`, `"left bottom"`, `"left"`, `"left top"`, `"north"`, `"northeast"`, `"east"`, `"southeast"`, `"south"`, `"southwest"`, `"west"`, `"northwest"`, `"center"`, `"centre"`, `"entropy"`, or `"attention"`

position, gravity or strategy to use when `fit` is `cover` or `contain`.

- `sharp.position`: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`.
- `sharp.gravity`: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
- `sharp.strategy`: `cover` only, dynamically crop using either the `entropy` or `attention` strategy.

This is passed as `position` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `background`

example: `"#7743CE"`, `"rgb(255, 255, 255)"`, `{r:0,g:0,b:0,alpha:1}`

background colour when using a `fit` of `contain`, parsed by the [color](https://www.npmjs.com/package/color) module, defaults to black without transparency.

This is passed as `background` in the [`options` of the parameters of sharp's resize function](https://sharp.pixelplumbing.com/api-resize#parameters)

### `format`

When unspecified, outputs the same format as the imported file.

### `quality`

From 1-100, 1 being most compression and worst quality, 100 being least compression and best quality.

This is passed as `quality` in the the options objects of [imagemin plugins](#imageminoptions)

### `sharpOptions`

##### default

quality is kept at 100 so [imagemin](https://github.com/imagemin/imagemin) will do the compression

```javascript
{
  png: { quality: 100 },
  jpeg: { quality: 100 },
  webp: { quality: 100 },
  tiff: { quality: 100 },
}
```

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

### `imageminOptions`

##### default

```javascript
{
  png: {
    name: "imagemin-optipng",
    options: { interlaced: true, optimizationLevel: 7 },
  },
  jpeg: {
    name: "imagemin-mozjpeg",
    options: { quality: 80 },
  },
  webp: {
    name: "imagemin-webp",
    options: { quality: 75 },
  },
}
```

imageminOptions can have any of the following keys: `png`, `jpeg`, `webp`, and `tiff`.

This loader uses 3 built-in [imagemin](https://github.com/imagemin/imagemin) plugins to optimize images, [imagemin-optipng](https://github.com/imagemin/imagemin-optipng), [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg), and [imagemin-webp](https://github.com/imagemin/imagemin-webp). The [`quality`](#quality) option above will override the `quality` field of every plugin.

If you want to use some other plugins or multiple plugins, first install the plugin you want to use, then:

```javascript
{
  imageminOptions: {
    png: "imagemin-pngquant";
  }
}
// or
{
  imageminOptions: {
    png: ["imagemin-optipng", "imagemin-pngquant"];
  }
}
// or
{
  imageminOptions: {
    png: ["imagemin-optipng", { name: "imagemin-pngquant", options: {} }];
  }
}
```

To disable imagemin for a particular format:

```javascript
{
  imageminOptions: {
    png: null;
  }
}
```

### `fileLoader`

Name or path of a loader that takes in buffers.

This is needed because the output file format is sometimes different from the input file format.

By default this loader tries to find `file-loader` and change the `"[ext]"` in their `options.name`.

### `fileLoaderOptions`

##### default

`options` is the options passed to this loader, `existingOptions` is the options passed to the loader specified in [`fileLoader`](#fileloader)

```javascript
function defaultFileLoaderOptionsGenerator(options, existingOptions) {
  let name = existingOptions?.name;

  if (name === undefined) {
    name = `[contenthash].${options.format}`;
  } else if (typeof name === "string") {
    name = name.replace("[ext]", options.format);
  } else if (typeof name === "function") {
    name = (file: string) => {
      const nameFn = existingOptions.name;

      return nameFn(file).replace("[ext]", format);
    };
  }

  return {
    ...existingOptions,
    name,
  };
}
```

This function is used to generate the options for the loader specified by [`fileLoader`](#fileloader)
