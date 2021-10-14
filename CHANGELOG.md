# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.0.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v4.1.0...v5.0.0) (2021-10-14)


### ⚠ BREAKING CHANGES

* remove imagemin dependencies and remove imageminOptions from options

### Features

* remove imagemin ([#402](https://github.com/Calvin-LL/webpack-image-resize-loader/issues/402)) ([b3d6f92](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/b3d6f92bb84a7a449bfb3ebd5c07b6f244e45a62))

## [4.1.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v4.0.2...v4.1.0) (2021-06-05)


### Features

* add support for AVIF ([d15f0a4](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/d15f0a4998241e6c9341e568c569431ad587bae5))

### [4.0.2](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v4.0.1...v4.0.2) (2021-04-06)

### [4.0.1](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v4.0.0...v4.0.1) (2021-04-06)

## [4.0.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.1.0...v4.0.0) (2021-01-19)


### ⚠ BREAKING CHANGES

* remove built-in file-loader

### Features

* fileLoaderOptionsGenerator can also be a string of a js function ([d856968](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/d8569685073e2cbd6ecba863e6498574bc1d114c))
* make file loader search more loose ([ae4c817](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/ae4c817b7699482fba805abbf9024c51f672cb3a))
* remove built-in file-loader ([77619ac](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/77619ac9ed44e4140973d6ec1143f78ba3d780d3))

## [3.1.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.6...v3.1.0) (2020-12-13)


### Features

* add imagemin to optimize images ([cb89ac6](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/cb89ac63fad86ac1e5c8472b61194606eca95d6a))

### [3.0.6](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.5...v3.0.6) (2020-11-30)

### [3.0.5](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.4...v3.0.5) (2020-11-29)

### [3.0.4](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.3...v3.0.4) (2020-11-29)

### [3.0.3](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.2...v3.0.3) (2020-11-16)

### Bug Fixes

- import with query where the value is a number not working ([2efa94d](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/2efa94dcdaf82b472ad409c4609fea5629f3deeb))

### [3.0.2](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.1...v3.0.2) (2020-11-03)

### [3.0.1](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v3.0.0...v3.0.1) (2020-10-28)

## [3.0.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.6...v3.0.0) (2020-09-02)

### ⚠ BREAKING CHANGES

- **deps:** Update to [sharp@0.26](https://sharp.pixelplumbing.com/changelog#v026---zoom)

- **deps:** update packages ([40abb83](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/40abb83caf12c9bf62ec62d49849659c125bc782))

### [2.0.6](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.5...v2.0.6) (2020-06-24)

### [2.0.5](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.4...v2.0.5) (2020-06-23)

### [2.0.4](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.2...v2.0.4) (2020-06-21)

### Bug Fixes

- scale not taking precedence and scaleUp not applying to scale ([29e97f2](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/29e97f251f9e6c99449447515064a54c95efcb1c))

### [2.0.2](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.1...v2.0.2) (2020-06-19)

### [2.0.1](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v2.0.0...v2.0.1) (2020-06-19)

## [2.0.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v1.1.1...v2.0.0) (2020-06-19)

### ⚠ BREAKING CHANGES

- **options:** options structure changed

- **options:** change options structure ([ddf7e6e](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/ddf7e6e767bdbf8b151d69b8dfb477827615f2f5))

### [1.1.1](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v1.1.0...v1.1.1) (2020-06-19)

### Bug Fixes

- query not overriding options ([f49daf7](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/f49daf7aac09ce014eddc901a0d07171d8175e8b))

## [1.1.0](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v1.0.1...v1.1.0) (2020-06-18)

### Features

- add scale option ([d201353](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/d201353b82d133766f84aa94350702ee95145aa4))

### Bug Fixes

- queries not validated ([a48f9bc](https://github.com/Calvin-LL/webpack-image-resize-loader/commit/a48f9bc18fbf28e108e436965eadf7d6b440bd0d))

### [1.0.1](https://github.com/Calvin-LL/webpack-image-resize-loader/compare/v1.0.0...v1.0.1) (2020-06-17)

## 1.0.0 (2020-06-16)
