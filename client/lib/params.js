var params = module.exports = {}

params.petal = {
    curveHeightStart: -Math.PI
  , curveHeightEnd:  Math.PI
  , curveHeightScale: 30
  , curveWidthStart: 0
  , curveWidthEnd: Math.PI
  , curveWidthScale: 50
};

params.flower = {
    layers: 5
  , petals: 9
  , twist: Math.PI / 1.25
  , height: 90
  , spread: 0.5
  , growth: 1
  , twirl: 0.1
  , spreadOffset: 0
  , lightness: 0.5
  , redness: 1.3
  , greeness: 0.9
  , blueness: 1.2
  , lines: 15
  , lineDarkness: 0.3
  , dirtiness: 0.025 // 0.05
  , border: 0.4
  , borderSize: 0.1
  , wireframe: false
  , visible: true
};

params.timed = {
    heightPhaseSpeed: 0
  , growthGoal: params.flower.growth
  , twirlSpeed: 0
  , twirlProgress: 0
  , offset: 0
  , hueSpeed: 0
  , hueProgress: 180 * 0.2
}