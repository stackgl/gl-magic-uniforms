var extract = require('gl-shader-extract')
var dup = require('dup')

module.exports = MagicUniforms

function MagicUniforms (gl, program, uniforms) {
  uniforms = uniforms || extract(gl, program).uniforms
  uniforms.sort(compareString)

  var magic = {}

  for (var i = 0; i < uniforms.length; i++) {
    var name = uniforms[i].name
    var type = uniforms[i].type

    var chain = []
    var base = name.replace(/\[\d+\]|\.[^\.\[]+/g, function (key) {
      var isArray = !key.indexOf('[')
      if (isArray) {
        key = key.slice(1, -1)
      } else {
        key = key.slice(1)
      }

      chain.push({
        key: key,
        isArray: isArray
      })

      return ''
    })

    chain.unshift({
      key: base,
      isArray: false
    })

    if (chain.length <= 1) {
      define(gl, program, magic, name, name, type)
    } else {
      var parent = magic
      for (var t = 0; t < chain.length - 1; t++) {
        var info = chain[t]
        parent[info.key] = parent[info.key] || (chain[t + 1].isArray ? [] : {})
        parent = parent[info.key]
      }

      define(gl, program, parent, chain[chain.length - 1].key, name, type)
    }
  }

  // Ensure parent nodes can also set their children's uniforms
  walk(magic)
  function walk (node) {
    var keys = Object.keys(node)

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var desc = Object.getOwnPropertyDescriptor(node, key)
      if (!desc.configurable) continue
      walk(node[key])
      parentSetter(node, key)
    }
  }

  return magic
}

function parentSetter (parent, key) {
  var orig = parent[key]

  Object.defineProperty(parent, key, {
    get: function () { return orig },
    set: function (value) {
      for (var key in value) {
        orig[key] = value[key]
      }
    },
    enumerable: true,
    configurable: false
  })
}

function define (gl, program, parent, key, name, type) {
  var location = gl.getUniformLocation(program, name)
  var uploader = getUploadFunctionName(type, name)
  var isMatrix = type.indexOf('mat') === 0
  var value = defaultValue(type, name)

  Object.defineProperty(parent, key, {
    get: function () { return value },
    set: isMatrix ? function (_value) {
      value = _value
      return gl[uploader](location, false, value)
    } : function (_value) {
      value = _value
      return gl[uploader](location, value)
    },
    enumerable: true,
    configurable: false
  })
}

// TODO: merge with getUploadFunctionName
function defaultValue (type, name) {
  switch (type) {
    case 'bool':
      return false
    case 'int':
    case 'float':
    case 'sampler':
    case 'sampler2D':
    case 'samplerCube':
      return 0
  }

  // vec2, vec3, vec4, bvec2, bvec3, bvec4, ivec2, ivec3, ivec4...
  var vidx = type.indexOf('vec')
  if (vidx >= 0 && vidx <= 1 && type.length === 4 + vidx) {
    var vecDimensions = parseInt(type.charAt(type.length - 1), 10)
    if (vecDimensions < 2 || vecDimensions > 4) {
      throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
    }
    if (type.charAt(0) === 'b') {
      return dup(vecDimensions, false)
    }
    return dup(vecDimensions, 0)
  }

  // mat2, mat3, mat4
  if (type.indexOf('mat') === 0 && type.length === 4) {
    var matDimensions = parseInt(type.charAt(type.length - 1), 10)
    if (matDimensions < 2 || matDimensions > 4) {
      throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
    }
    return dup(matDimensions * matDimensions, 0)
  }

  throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
}

function getUploadFunctionName (type, name) {
  switch (type) {
    case 'float':
      return 'uniform1f'
    case 'bool':
    case 'int':
    case 'sampler':
    case 'sampler2D':
    case 'samplerCube':
      return 'uniform1i'
  }

  var vidx = type.indexOf('vec')
  var dimensions = parseInt(type.charAt(type.length - 1), 10)
  if (dimensions < 2 || dimensions > 4) {
    throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
  }

  if (vidx >= 0 && vidx <= 1 && type.length === 4 + vidx) {
    switch (type.charAt(0)) {
      case 'b':
      case 'i':
        return 'uniform' + dimensions + 'iv'
      case 'v':
        return 'uniform' + dimensions + 'fv'
    }

    throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
  }

  if (type.indexOf('mat') === 0 && type.length === 4) {
    return 'uniformMatrix' + dimensions + 'fv'
  }

  throw new Error('Invalid data type (' + type + ') for uniform "' + name + '"')
}

function compareString (a, b) {
  return a.name.localeCompare(b.name)
}
