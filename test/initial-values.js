const Program = require('./_createProgram')
const program = require('./_catchall')
const Uniforms = require('../')
const test = require('tape')

test('gl-magic-uniforms: initial values', function (t) {
  var uniforms = Uniforms(Program.gl, program)

  t.equal(uniforms._bool, false, 'initial value: bool')
  t.equal(uniforms._float, 0, 'initial value: float')
  t.equal(uniforms._int, 0, 'initial value: int')
  t.equal(uniforms._sampler2D, 0, 'initial value: sampler2D')
  t.equal(uniforms._samplerCube, 0, 'initial value: samplerCube')

  t.deepEqual(uniforms._vec2, [0, 0], 'initial value: vec2')
  t.deepEqual(uniforms._vec3, [0, 0, 0], 'initial value: vec3')
  t.deepEqual(uniforms._vec4, [0, 0, 0, 0], 'initial value: vec4')
  t.deepEqual(uniforms._bvec2, [false, false], 'initial value: bvec2')
  t.deepEqual(uniforms._bvec3, [false, false, false], 'initial value: bvec3')
  t.deepEqual(uniforms._bvec4, [false, false, false, false], 'initial value: bvec4')
  t.deepEqual(uniforms._ivec2, [0, 0], 'initial value: ivec2')
  t.deepEqual(uniforms._ivec3, [0, 0, 0], 'initial value: ivec3')
  t.deepEqual(uniforms._ivec4, [0, 0, 0, 0], 'initial value: ivec4')

  t.deepEqual(uniforms._mat2, [0, 0, 0, 0], 'initial value: mat2')
  t.deepEqual(uniforms._mat3, [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ], 'initial value: mat3')

  t.deepEqual(uniforms._mat4, [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ], 'initial value: mat4')

  t.deepEqual(uniforms._vec4_5, [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ], 'initial value: vec4[5]')

  t.deepEqual(uniforms._bvec3_2, [
    [false, false, false],
    [false, false, false]
  ], 'initial value: bvec3[2]')

  t.deepEqual(uniforms.light, {
    pos: [0, 0, 0],
    dir: [0, 0, 0]
  }, 'initial value: Light struct')

  t.deepEqual(uniforms.system, {
    ambientColor: [0, 0, 0],
    lights: [{
      pos: [0, 0, 0],
      dir: [0, 0, 0]
    }, {
      pos: [0, 0, 0],
      dir: [0, 0, 0]
    }, {
      pos: [0, 0, 0],
      dir: [0, 0, 0]
    }]
  }, 'initial value: LightSystem struct')

  t.end()
})
