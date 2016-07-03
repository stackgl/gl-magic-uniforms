'use strict'

var GL = require('gl')
var gl = GL(256, 256)

module.exports = function (vert, frag) {
  var program = gl.createProgram()
  var vertShader = gl.createShader(gl.VERTEX_SHADER)
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(vertShader, vert)
  gl.shaderSource(fragShader, frag)
  gl.compileShader(vertShader)
  gl.compileShader(fragShader)

  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    let err = gl.getShaderInfoLog(vertShader)
    throw new Error(err)
  }
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    let err = gl.getShaderInfoLog(fragShader)
    throw new Error(err)
  }

  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let err = gl.getProgramInfoLog(program)
    throw new Error(err)
  }

  gl.useProgram(program)

  return program
}

module.exports.gl = gl
