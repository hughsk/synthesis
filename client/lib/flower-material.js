var shaders = require('./shaders')

module.exports = function FlowerMaterial(params, geometry) {
  var shader = {
      vertexShader: shaders.petalVert
    , fragmentShader: shaders.petalFrag
    , wireframe: params.flower.wireframe
  };

  shader.attributes = {
      xpos: { type: 'f', value: geometry.data.lengths }
    , widths: { type: 'f', value: geometry.data.widths }
  };

  shader.uniforms = {
      curveHeightStart : params.petal.curveHeightStart
    , curveHeightEnd   : params.petal.curveHeightEnd
    , curveHeightScale : params.petal.curveHeightScale
    , curveWidthStart  : params.petal.curveWidthStart
    , curveWidthEnd    : params.petal.curveWidthEnd
    , curveWidthScale  : params.petal.curveWidthScale
    , lightness        : params.flower.lightness
    , redness          : params.flower.redness
    , greeness         : params.flower.greeness
    , blueness         : params.flower.blueness
    , lines            : params.flower.lines
    , lineDarkness     : params.flower.lineDarkness
    , growth           : params.flower.growth
    , twirl            : params.flower.twirl
    , dirtiness        : params.flower.dirtiness
    , border           : params.flower.border
    , borderSize       : params.flower.borderSize
  };

  Object.keys(shader.uniforms).forEach(function(key) {
    shader.uniforms[key] = {
        type: 'f'
      , value: shader.uniforms[key]
    }
  })

  return new THREE.ShaderMaterial(shader);
};