var EventEmitter = require('events').EventEmitter
  , mousetrap = require('mousetrap')

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

flora.on('change:d1', function(d1) {
  mesh.material.uniforms.growth.value = d1 / 1000
})

;[1,2,3,4,5,6,7,8,9].forEach(function(n) {
  mousetrap.bind(n+'', function() {
    mesh.params.flower.layers = n
    mesh.rebuild()
  });
  mousetrap.bind('shift+'+n, function() {
    mesh.params.flower.petals = n
    mesh.rebuild()
  })
})

mousetrap.bind('up', function() {
  mesh.params.flower.spread *= 1.1
  mesh.update()
})
mousetrap.bind('down', function() {
  mesh.params.flower.spread /= 1.1
  mesh.update()
})
