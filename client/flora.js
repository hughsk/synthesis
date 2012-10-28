var EventEmitter = require('events').EventEmitter

var flora = module.exports = new EventEmitter
  , FlowerObject = require('./lib/flower-object.js')

var camera
  , scene
  , renderer
  , mesh

flora.init = function() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
      75
    , window.innerWidth / window.innerHeight
    , 1
    , 10000
  )
  
  camera.position.y = 300
  camera.position.z = 1480

  mesh = new FlowerObject()

  mesh.position.x = 0
  mesh.position.z = 500

  scene.add(camera)
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer({
      antialias: true
    , precision: 'highp'
  });

  renderer.setSize(
      window.innerWidth
    , window.innerHeight
  );

  document.body.appendChild(renderer.domElement);
};

flora.animate = function() {
  requestAnimationFrame(flora.animate);
  flora.render();
};

flora.render = function() {
  renderer.render( scene, camera );
};

flora.init()
flora.animate()