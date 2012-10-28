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
        curveHeightStart: {
            type: 'f', value: params.petal.curveHeightStart
        }
        , curveHeightEnd: {
            type: 'f', value: params.petal.curveHeightEnd
        }
        , curveHeightScale: {
            type: 'f', value: params.petal.curveHeightScale
        }
        , curveWidthStart: {
            type: 'f', value: params.petal.curveWidthStart
        }
        , curveWidthEnd: {
            type: 'f', value: params.petal.curveWidthEnd
        }
        , curveWidthScale: {
            type: 'f', value: params.petal.curveWidthScale
        }
        , lightness: {
            type: 'f', value: params.flower.lightness
        }
        , redness: {
            type: 'f', value: params.flower.redness
        }
        , greeness: {
            type: 'f', value: params.flower.greeness
        }
        , blueness: {
            type: 'f', value: params.flower.blueness
        }
        , lines: {
            type: 'f', value: params.flower.lines
        }
        , lineDarkness: {
            type: 'f', value: params.flower.lineDarkness
        }
        , growth: {
            type: 'f', value: params.flower.growth
        }
        , twirl: {
            type: 'f', value: params.flower.twirl
        }
        , dirtiness: {
            type: 'f', value: params.flower.dirtiness
        }
        , border: {
            type: 'f', value: params.flower.border
        }
        , borderSize: {
            type: 'f', value: params.flower.borderSize
        }
    };

    return new THREE.ShaderMaterial(shader);
};