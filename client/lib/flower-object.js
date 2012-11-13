var PetalGeometry = require('./petal-geometry')
  , FlowerMaterial = require('./flower-material')
  , interpolator = require('interpolator')
  , params = require('./params')
  , clone = require('clone')

var sine = interpolator.sin(0, 1)

module.exports = FlowerObject = function(fraction) {
  THREE.Object3D.call(this);

  this.params = clone(params);

  this.fraction = fraction * Math.PI * 2
  this.petals = [];
  this.petalGeometry = new PetalGeometry();
  this.rebuilt = false
  this.material = FlowerMaterial(
      this.params
    , this.petalGeometry
  );

  this.rebuild();
};

FlowerObject.prototype = Object.create(THREE.Object3D.prototype);

function decideOrientation(petal, params, p, l) {
  var lc = params.flower.layers
    , pc = params.flower.petals

  petal.rotation.y = 2 * Math.PI * (p / pc);
  petal.rotation.y += params.flower.twist * l;

  petal.rotation.z = params.flower.spreadOffset + params.flower.spread * Math.PI * l / lc;
  petal.position.y = l / lc * params.flower.height;
};

FlowerObject.prototype.tick = function() {
  var offset

  this.rebuilt = false
  this.material.uniforms.growth.value = interpolator.linear(
      this.material.uniforms.growth.value
    , this.params.timed.growthGoal
  )(0.055)

  offset = sine(Date.now() / 2000 + this.fraction)
  offset = interpolator.linear(1, offset)(this.params.timed.offset)

  this.params.petal.curveHeightStart += this.params.timed.heightPhaseSpeed * offset
  this.params.petal.curveHeightEnd += this.params.timed.heightPhaseSpeed * offset

  this.material.uniforms.curveHeightStart.value = this.params.petal.curveHeightStart
  this.material.uniforms.curveHeightEnd.value = this.params.petal.curveHeightEnd

};

FlowerObject.prototype.clear = function() {
  var self = this

  this.petals.forEach(function(child) {
    self.remove(child);
  });
  this.petals = []
};

FlowerObject.prototype.rebuild = function() {
  var l, p, pc, lc
  var self = this
    , petal

  lc = this.params.flower.layers;
  pc = this.params.flower.petals;

  if (this.rebuilt) return
  this.rebuilt = true

  for (l = 0; l < lc; l += 1) {
    for (p = 0; p < pc; p += 1) {
      petal = this.children[l * pc + p]

      if (!petal) {
        petal = new THREE.Mesh(this.petalGeometry, this.material);
        this.petals.push(petal);
        this.add(petal);
      }
  
      petal.visible = true    
      decideOrientation(petal, this.params, p, l);
    }
  }

  this.petals.slice(
    Math.ceil(this.params.flower.layers) * Math.ceil(this.params.flower.petals)
  ).map(function(petal) {
    petal.visible = false
  })
};

FlowerObject.prototype.update = function() {
  var l, p, pc, lc, petal;

  lc = this.params.flower.layers;
  pc = this.params.flower.petals;

  for (l = 0; l < lc; l += 1) {
    for (p = 0; p < pc; p += 1) {
      petal = this.children[l * pc + p];
      decideOrientation(petal, this.params, p, l);
    }
  }
};