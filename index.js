var extract = require('gl-shader-extract')
var dup = require('dup')

module.exports = MagicUniforms

function MagicUniforms (gl, program, uniforms, opts) {
  opts = opts || {}
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
      define(gl, program, magic, name, name, type, opts)
    } else {
      var parent = magic
      for (var t = 0; t < chain.length - 1; t++) {
        var info = chain[t]
        parent[info.key] = parent[info.key] || (chain[t + 1].isArray ? [] : {})
        parent = parent[info.key]
      }

      define(gl, program, parent, chain[chain.length - 1].key, name, type, opts)
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

function define (gl, program, parent, key, name, type, opts) {
  var cacheScalars = 'cacheScalars' in opts ? opts.cacheScalars : true
  var cacheVectors = !!opts.cacheVectors
  var location = gl.getUniformLocation(program, name)
  var uploader = getUploadFunctionName(type, name)
  var isMatrix = type.indexOf('mat') === 0
  var value = defaultValue(type, name)
  var isScalar = !Array.isArray(value)

  // Matrix uniforms have their own function signature that needs
  // to be used. Scalar values, i.e. floats/bools/ints/samplers,
  // get cached if their values don't change to minimise GPU bandwidth.
  // Vectors/matrices are uploaded directly: unsure how it impacts
  // performance with vectors, but it generally works out slower to
  // cache/check matrices.
  var setter
  if (isMatrix) {
    setter = matrix
  } else
  if (isScalar) {
    setter = cacheScalars ? cachedScalar : basic
  } else {
    setter = cacheVectors ? cachedVector(value.length) : basic
  }

  Object.defineProperty(parent, key, {
    get: function () { return value },
    set: setter,
    enumerable: true,
    configurable: false
  })

  function matrix (_value) {
    value = _value
    return gl[uploader](location, false, value)
  }

  function cachedScalar (_value) {
    if (value === _value) return
    value = _value
    return gl[uploader](location, value)
  }

  function cachedVector (size) {
    switch (size) {
      case 1: return cachedVector1
      case 2: return cachedVector2
      case 3: return cachedVector3
      case 4: return cachedVector4
      default: return basic
    }
  }

  function basic (_value) {
    value = _value
    return gl[uploader](location, value)
  }

  function cachedVector1 (_value) {
    if (value[0] === _value[0]) return
    value = _value
    return gl[uploader](location, value)
  }

  function cachedVector2 (_value) {
    if (
      value[0] === _value[0] &&
      value[1] === _value[1]
    ) return
    value = _value
    return gl[uploader](location, value)
  }

  function cachedVector3 (_value) {
    if (
      value[0] === _value[0] &&
      value[1] === _value[1] &&
      value[2] === _value[2]
    ) return
    value = _value
    return gl[uploader](location, value)
  }

  function cachedVector4 (_value) {
    if (
      value[0] === _value[0] &&
      value[1] === _value[1] &&
      value[2] === _value[2] &&
      value[3] === _value[3]
    ) return
    value = _value
    return gl[uploader](location, value)
  }
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
