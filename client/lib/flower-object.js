var PetalGeometry = require('./petal-geometry')
  , FlowerMaterial = require('./flower-material')
  , params = require('./params')
  , clone = require('clone')

module.exports = FlowerObject = function() {
  THREE.Object3D.call(this);

  this.flowerGeometry = new PetalGeometry();
  this.flowerParams = clone(params);

  this.flowerMaterial = FlowerMaterial(
      this.flowerParams
    , this.flowerGeometry
  );

  this.flowerMeshes = [];

  this.rebuild();
};

FlowerObject.prototype = Object.create(THREE.Object3D.prototype);

FlowerObject.prototype.rebuild = function() {
  var l, p, pc, lc, petal, self = this;

  if (this.children && this.children.length) {
    this.children.forEach(function(child) {
      self.remove(child);
    });
  }

  lc = this.flowerParams.flower.layers;
  pc = this.flowerParams.flower.petals;
  
  for (l = 0; l < lc; l += 1) {
    for (p = 0; p < pc; p += 1) {
      petal = new THREE.Mesh(this.flowerGeometry, this.flowerMaterial);
      
      this.decideOrientation(p, l, petal);

      this.flowerMeshes.push(petal);
      this.add(petal);
    }
  }
};

FlowerObject.prototype.update = function() {
  var l, p, pc, lc, petal, self = this;

  lc = this.flowerParams.flower.layers;
  pc = this.flowerParams.flower.petals;
  
  for (l = 0; l < lc; l += 1) {
    for (p = 0; p < pc; p += 1) {
      petal = this.children[l * pc + p];

      this.decideOrientation(p, l, petal);
    }
  }
};

FlowerObject.prototype.decideOrientation = function(p, l, petal) {
  var lc = this.flowerParams.flower.layers
    , pc = this.flowerParams.flower.petals

  petal.rotation.y = 2 * Math.PI * (p / pc);
  petal.rotation.y += this.flowerParams.flower.twist * l;
  
  petal.rotation.z = this.flowerParams.flower.spreadOffset + this.flowerParams.flower.spread * Math.PI * l / lc;

  petal.position.y = l / lc * this.flowerParams.flower.height;
};