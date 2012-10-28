var PetalGeometry = require('./petal-geometry')
  , FlowerMaterial = require('./flower-material')
  , params = require('./params')
  , clone = require('clone')

module.exports = FlowerObject = function() {
  THREE.Object3D.call(this);

  this.params = clone(params);

  this.petals = [];
  this.petalGeometry = new PetalGeometry();
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

FlowerObject.prototype.clear = function() {
  var self = this

  this.petals.forEach(function(child) {
    self.remove(child);
  });
  this.petals = []
};

FlowerObject.prototype.rebuild = function() {
  var l, p, pc, lc, petal, self = this;

  this.clear();

  lc = this.params.flower.layers;
  pc = this.params.flower.petals;
  
  for (l = 0; l < lc; l += 1) {
    for (p = 0; p < pc; p += 1) {
      petal = new THREE.Mesh(this.petalGeometry, this.material);
      
      decideOrientation(petal, this.params, p, l);

      this.petals.push(petal);
      this.add(petal);
    }
  }
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