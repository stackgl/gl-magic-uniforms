const Program = require('./_createProgram')

module.exports = Program(`
  precision highp float;
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 1, 1);
  }
`, `
  precision highp float;

  uniform float _float;
  uniform float _float2;
  uniform bool _bool;
  uniform int _int;
  uniform sampler2D _sampler2D;
  uniform samplerCube _samplerCube;

  uniform vec2 _vec2;
  uniform vec3 _vec3;
  uniform vec4 _vec4;

  uniform bvec2 _bvec2;
  uniform bvec3 _bvec3;
  uniform bvec4 _bvec4;

  uniform ivec2 _ivec2;
  uniform ivec3 _ivec3;
  uniform ivec4 _ivec4;

  uniform vec4 _vec4_5[5];
  uniform bvec3 _bvec3_2[2];

  uniform mat2 _mat2;
  uniform mat3 _mat3;
  uniform mat4 _mat4;

  struct Light {
    vec3 pos;
    vec3 dir;
  };

  uniform Light light;

  struct LightSystem {
    Light[3] lights;

    vec3 ambientColor;
  };

  uniform LightSystem system;

  void main() {
    gl_FragColor = vec4(1);

    // We need to include these somewhere in the shader source
    // for them to be consistently detected as uniforms.
    gl_FragColor.r += _float * _float2;
    gl_FragColor.r += float(_int);
    gl_FragColor.r += float(_bool);

    gl_FragColor += texture2D(_sampler2D, vec2(0));
    gl_FragColor += textureCube(_samplerCube, vec3(0));

    gl_FragColor.r += _vec2.x;
    gl_FragColor.r += _vec3.x;
    gl_FragColor.r += _vec4.x;
    gl_FragColor.r += float(_bvec2.x);
    gl_FragColor.r += float(_bvec3.x);
    gl_FragColor.r += float(_bvec4.x);
    gl_FragColor.r += float(_ivec2.x);
    gl_FragColor.r += float(_ivec3.x);
    gl_FragColor.r += float(_ivec4.x);
    gl_FragColor.r += float(_vec4_5[0].x);
    gl_FragColor.r += float(_bvec3_2[0].x);
    gl_FragColor.r += _mat2[0].x;
    gl_FragColor.r += _mat3[0].x;
    gl_FragColor.r += _mat4[0].x;

    gl_FragColor.r += light.pos.r;
    gl_FragColor.r += system.lights[0].pos.r;
  }
`)
