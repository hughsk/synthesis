var EventEmitter = require('events').EventEmitter
  , mousetrap = require('mousetrap')
  , debounce = require('debounce')
  , clone = require('clone')

var flora = module.exports = new EventEmitter
  , PetalGeometry = require('./lib/petal-geometry.js')
  , FlowerMaterial = require('./lib/flower-material.js')

flora.params = require('./lib/params.js')

var camera
  , scene
  , renderer
  , geometry
  , material
  , mesh

flora.FlowerObject = function() {
    THREE.Object3D.call(this);

    this.flowerGeometry = new PetalGeometry();
    this.flowerParams = clone(flora.params);

    this.flowerMaterial = FlowerMaterial(
          this.flowerParams
        , this.flowerGeometry
    );

    this.flowerMeshes = [];

    this.rebuild();
};

flora.FlowerObject.prototype = Object.create( THREE.Object3D.prototype );

flora.FlowerObject.prototype.rebuild = function() {
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

flora.FlowerObject.prototype.update = function() {
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

flora.FlowerObject.prototype.decideOrientation = function(p, l, petal) {
    var lc = this.flowerParams.flower.layers
      , pc = this.flowerParams.flower.petals

    petal.rotation.y = 2 * Math.PI * (p / pc);
    petal.rotation.y += this.flowerParams.flower.twist * l;
    
    petal.rotation.z = this.flowerParams.flower.spreadOffset + this.flowerParams.flower.spread * Math.PI * l / lc;

    petal.position.y = l / lc * this.flowerParams.flower.height;
};

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 300;
    camera.position.z = 1480;
    scene.add( camera );

    mesh = new flora.FlowerObject()

    // attachProperties(group);

    mesh.position.x = 0;
    mesh.position.z = 500;

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
          antialias: true
        , precision: 'highp'
    });

    renderer.setSize( window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );
};

function animate() {
    requestAnimationFrame( animate );
    render();
};

function render() {

    // mesh.rotation.y = Date.now() * 0.0007;
    mesh.flowerMaterial.uniforms.growth.value = (Math.sin(Date.now() * 0.001) + 1) * 0.6;

    renderer.render( scene, camera );
};