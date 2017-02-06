const Program = require('./_createProgram')
const program = require('./_catchall')
const Uniforms = require('../')
const test = require('tape')

var uniforms = Uniforms(Program.gl, program)
var gl = Program.gl

test('gl-magic-uniforms: values are cached', function (t) {
  var cFloat = 0
  var cInt = 0
  var cBool = 0

  gl.uniform1f = () => cFloat++
  uniforms._float = 5
  uniforms._float = 2
  uniforms._float = 2
  t.equal(cFloat, 2, 'uniform1f called 2 times')
  uniforms._float2 = 2
  t.equal(cFloat, 3, 'uniform1f called 3 times')
  uniforms._float2 = 2
  uniforms._float2 = 5
  uniforms._float = 5
  t.equal(cFloat, 5, 'uniform1f called 5 times')

  gl.uniform1i = () => cInt++
  uniforms._int = 0
  uniforms._int = 1
  t.equal(cInt, 1, 'uniform1i called 1 time')

  gl.uniform1i = () => cBool++
  uniforms._bool = true
  uniforms._bool = true
  uniforms._bool = true
  t.equal(cBool, 1, 'uniform1i called 1 time')
  uniforms._bool = false
  t.equal(cBool, 2, 'uniform1i called 2 times')

  t.end()
})
