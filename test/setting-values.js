const Program = require('./_createProgram')
const program = require('./_catchall')
const Uniforms = require('../')
const test = require('tape')

var uniforms = Uniforms(Program.gl, program)
var gl = Program.gl

test('gl-magic-uniforms: setting scalar values', function (t) {
  uniforms._bool = true
  t.equal(getUniform('_bool'), true, 'bool: updated value')
  t.equal(uniforms._bool, true, 'bool: local value')

  uniforms._int = 20
  t.equal(getUniform('_int'), 20, 'int: updated value')
  t.equal(uniforms._int, 20, 'int: local value')

  uniforms._sampler2D = 2
  t.equal(getUniform('_sampler2D'), 2, 'sampler2D: updated value')
  t.equal(uniforms._sampler2D, 2, 'sampler2D: local value')

  uniforms._samplerCube = 2
  t.equal(getUniform('_samplerCube'), 2, 'samplerCube: updated value')
  t.equal(uniforms._samplerCube, 2, 'samplerCube: local value')
  t.end()
})

test('gl-magic-uniforms: setting vector values', function (t) {
  uniforms._vec2 = [5, 6.6]
  t.deepEqual(getUniform('_vec2'), new Float32Array([5, 6.6]), 'vec2: updated value')
  t.deepEqual(uniforms._vec2, [5, 6.6], 'vec2: local value')

  uniforms._vec3 = [5, 6.6, 9]
  t.deepEqual(getUniform('_vec3'), new Float32Array([5, 6.6, 9]), 'vec3: updated value')
  t.deepEqual(uniforms._vec3, [5, 6.6, 9], 'vec3: local value')

  uniforms._vec4 = [5, 6.6, 9, -2]
  t.deepEqual(getUniform('_vec4'), new Float32Array([5, 6.6, 9, -2]), 'vec4: updated value')
  t.deepEqual(uniforms._vec4, [5, 6.6, 9, -2], 'vec4: local value')

  uniforms._bvec2 = [true, false]
  t.deepEqual(getUniform('_bvec2'), [true, false], 'bvec2: updated value')
  t.deepEqual(uniforms._bvec2, [true, false], 'bvec2: local value')

  uniforms._bvec3 = [true, false, false]
  t.deepEqual(getUniform('_bvec3'), [true, false, false], 'bvec3: updated value')
  t.deepEqual(uniforms._bvec3, [true, false, false], 'bvec3: local value')

  uniforms._bvec4 = [true, false, false, true]
  t.deepEqual(getUniform('_bvec4'), [true, false, false, true], 'bvec4: updated value')
  t.deepEqual(uniforms._bvec4, [true, false, false, true], 'vec4: local value')

  uniforms._ivec2 = [5, 6]
  t.deepEqual(getUniform('_ivec2'), new Int32Array([5, 6]), 'ivec2: updated value')
  t.deepEqual(uniforms._ivec2, [5, 6], 'ivec2: local value')

  uniforms._ivec3 = [5, 6, 9]
  t.deepEqual(getUniform('_ivec3'), new Int32Array([5, 6, 9]), 'ivec3: updated value')
  t.deepEqual(uniforms._ivec3, [5, 6, 9], 'ivec3: local value')

  uniforms._ivec4 = [5, 6, 9, -2]
  t.deepEqual(getUniform('_ivec4'), new Int32Array([5, 6, 9, -2]), 'ivec4: updated value')
  t.deepEqual(uniforms._ivec4, [5, 6, 9, -2], 'ivec4: local value')
  t.end()
})

test('gl-magic-uniforms: setting matrix values', function (t) {
  uniforms._mat2 = [2, 3, 4, 5]
  t.deepEqual(getUniform('_mat2'), new Float32Array([2, 3, 4, 5]), 'mat2: updated value')
  t.deepEqual(uniforms._mat2, [2, 3, 4, 5], 'mat2: local value')

  uniforms._mat3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  t.deepEqual(getUniform('_mat3'), new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 'mat3: updated value')
  t.deepEqual(uniforms._mat3, [1, 2, 3, 4, 5, 6, 7, 8, 9], 'mat3: local value')

  uniforms._mat4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  t.deepEqual(getUniform('_mat4'), new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]), 'mat4: updated value')
  t.deepEqual(uniforms._mat4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 'mat4: local value')
  t.end()
})

test('gl-magic-uniforms: setting array values', function (t) {
  uniforms._vec4_5[0] = [1, 2, 3, 4]
  t.deepEqual(getUniform('_vec4_5[0]'), new Float32Array([1, 2, 3, 4]), 'vec4[5]: individual value')
  uniforms._vec4_5 = [
    [1, 2, 3, 4],
    [5, 2, 3, 4],
    [6, 2, 3, 4],
    [7, 2, 3, 4],
    [8, 2, 3, 4]
  ]
  t.deepEqual(getUniform('_vec4_5[0]'), new Float32Array([1, 2, 3, 4]), 'vec4[5]: bulk value')
  t.deepEqual(getUniform('_vec4_5[1]'), new Float32Array([5, 2, 3, 4]), 'vec4[5]: bulk value')
  t.deepEqual(getUniform('_vec4_5[2]'), new Float32Array([6, 2, 3, 4]), 'vec4[5]: bulk value')
  t.deepEqual(getUniform('_vec4_5[3]'), new Float32Array([7, 2, 3, 4]), 'vec4[5]: bulk value')
  t.deepEqual(getUniform('_vec4_5[4]'), new Float32Array([8, 2, 3, 4]), 'vec4[5]: bulk value')
  uniforms._vec4_5[4] = [9, 9, 9, 9]
  t.deepEqual(uniforms._vec4_5, [
    [1, 2, 3, 4],
    [5, 2, 3, 4],
    [6, 2, 3, 4],
    [7, 2, 3, 4],
    [9, 9, 9, 9]
  ], 'vec4[5]: local value')

  t.end()
})

test('gl-magic-uniforms: setting struct values', function (t) {
  uniforms.light.pos = [2, 2, 2]
  t.deepEqual(getUniform('light.pos'), new Float32Array([2, 2, 2]), 'Light: individual value')

  uniforms.light = {
    pos: [1, 2, 3],
    dir: [4, 5, 6]
  }
  t.deepEqual(getUniform('light.pos'), new Float32Array([1, 2, 3]), 'Light: bulk value')
  t.deepEqual(getUniform('light.dir'), new Float32Array([4, 5, 6]), 'Light: bulk value')

  uniforms.system.ambientColor = [1, 2, 3]
  t.deepEqual(getUniform('system.ambientColor'), new Float32Array([1, 2, 3]), 'LightSystem: individual value')
  uniforms.system.lights[1].dir = [3, 4, 5]
  t.deepEqual(getUniform('system.lights[1].dir'), new Float32Array([3, 4, 5]), 'LightSystem: deep value')

  uniforms.system = {
    ambientColor: [1, 1, 1],
    lights: [{
      pos: [2, 2, 2],
      dir: [3, 3, 3]
    }, {
      pos: [4, 4, 4],
      dir: [5, 5, 5]
    }, {
      pos: [6, 6, 6],
      dir: [7, 7, 7]
    }]
  }
  t.deepEqual(getUniform('system.ambientColor'), new Float32Array([1, 1, 1]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[0].pos'), new Float32Array([2, 2, 2]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[0].dir'), new Float32Array([3, 3, 3]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[1].pos'), new Float32Array([4, 4, 4]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[1].dir'), new Float32Array([5, 5, 5]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[2].pos'), new Float32Array([6, 6, 6]), 'LightSystem: bulk value')
  t.deepEqual(getUniform('system.lights[2].dir'), new Float32Array([7, 7, 7]), 'LightSystem: bulk value')

  t.end()
})

function getUniform (param) {
  return gl.getUniform(program, gl.getUniformLocation(program, param))
}
