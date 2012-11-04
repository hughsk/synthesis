var EventEmitter = require('events').EventEmitter
  , mousetrap = require('mousetrap')
  , interpolator = require('interpolator')

var flora = module.exports = new EventEmitter
  , FlowerObject = require('./lib/flower-object.js')
  , gui = require('./lib/gui.js')

var camera
  , scene
  , renderer
  , meshes = []

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

  meshes.push(new FlowerObject(1/4))
  meshes.push(new FlowerObject(2/4))
  meshes.push(new FlowerObject(3/4))
  meshes.push(new FlowerObject(4/4))

  meshes[0].position.x = 0
  meshes[0].position.z = 500

  meshes[1].position.x = -800
  meshes[1].rotation.z = 0.5
  meshes[1].rotation.y = 0.75

  meshes[2].position.x = 800
  meshes[2].rotation.z = -0.5
  meshes[2].rotation.y = -0.75

  meshes[3].position.z = -700
  meshes[3].position.y = 900

  scene.add(camera)
  meshes.forEach(function(mesh) {
    scene.add(mesh)
  })

  renderer = new THREE.WebGLRenderer({
      antialias: true
    , precision: 'highp'
  });

  renderer.setSize(
      window.innerWidth
    , window.innerHeight
  );

  document.body.appendChild(renderer.domElement);

  flora.gui = gui(meshes)
};

flora.animate = function() {
  requestAnimationFrame(flora.animate);
  flora.render();
};

flora.render = function() {
  meshes.forEach(function(mesh) { mesh.tick() })
  renderer.render( scene, camera );
};

flora.init()
flora.animate()

// flora.on('change:d1', function(d1) {
//   mesh.material.uniforms.growth.value = d1 / 500
// })

// var chs = interpolator.linear(-Math.PI * 4, Math.PI * 4)
// flora.on('change:d2', function(d2) {
//   mesh.material.uniforms.curveHeightStart.value = chs(d2 / 1000)
// })

// ;[1,2,3,4,5,6,7,8,9].forEach(function(n) {
//   mousetrap.bind(n+'', function() {
//     mesh.params.flower.layers = n
//     mesh.rebuild()
//   });
//   mousetrap.bind('shift+'+n, function() {
//     mesh.params.flower.petals = n
//     mesh.rebuild()
//   })
// })

// mousetrap.bind('up', function() {
//   mesh.params.flower.spread *= 1.1
//   mesh.update()
// })
// mousetrap.bind('down', function() {
//   mesh.params.flower.spread /= 1.1
//   mesh.update()
// })
