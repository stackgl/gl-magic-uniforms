# gl-magic-uniforms

[![](https://img.shields.io/badge/stability-experimental-ffa100.svg?style=flat-square)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![](https://img.shields.io/npm/v/gl-magic-uniforms.svg?style=flat-square)](https://npmjs.com/package/gl-magic-uniforms)
[![](https://img.shields.io/circleci/project/stackgl/gl-magic-uniforms/master.svg?style=flat-square)](https://circleci.com/gh/stackgl/gl-magic-uniforms)

Create a magic getter/setter object for a given WebGLProgram's uniforms. This provides a standalone [gl-shader](https://github.com/stackgl/gl-shader)-style interface for setting shader programs' uniforms that you can use in your own projects.

## Usage

### `uniforms = Magic(gl, program[, uniforms])`

* `gl` is the `WebGLRenderingContext` that `program` is attached to.
* `program` is a `WebGLProgram` instance to modify the uniforms of.

Optionally, you can pass in a custom set of `uniforms` objects. This should be in the same format as the results of [gl-shader-extract](https://github.com/mattdesl/gl-shader-extract). If not supplied, uniforms are automatically inferred at runtime by inspecting `program`.

``` javascript
var uniforms = require('gl-magic-uniforms')

var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')
var program = gl.createProgram()
var start = Date.now()

// ...setup the program object...

var uniforms = MagicUniforms(gl, program)

gl.useProgram(program)
uniforms.time = (Date.now() - start) / 1000
uniforms.light = [1, 0, 1, 1]
```

Uniforms can now be got and set by name, in the same style as documented in [gl-shader](https://github.com/stackgl/gl-shader#uniforms).

_**Note:** `program` must be in use when setting `uniforms`, or unexpected behavior may occur. This is not done by default to avoid an excess of calls to `gl.useProgram`._

## License

MIT. See [LICENSE.md](LICENSE.md) for details.
