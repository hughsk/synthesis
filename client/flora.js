var EventEmitter = require('events').EventEmitter
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
  console.log(flora)
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

flora.update = function(property, value) {
  meshes.forEach(function(mesh) {
    flora.update[property](mesh, value)
  });
};

function clamp(val, min, max) {
  if (val < min) return min
  if (val > max) return max
  return val
};

flora.on('change:t0', function(d2) {
  meshes.forEach(function(mesh) {
    mesh.params.timed.growthGoal = Math.max((d2 - 65) / 200, 0)
  })
})
flora.on('change:p0', function(d2) {
  meshes.forEach(function(mesh) {
    mesh.params.timed.heightPhaseSpeed = Math.max((d2 - 65) / 1000, 0)
  })
})
flora.on('change:d0', function(d0) {
  flora.gui.properties.layers = Math.round(clamp(20 - (d0 - 65) / 50, 1, 20))
})
flora.on('change:d1', function(d1) {
  flora.gui.properties.petals = Math.round(clamp(20 - (d1 - 65) / 50, 1, 20))
})
// flora.on('change:p0', function(waveLength) {
//   meshes.forEach(function(mesh) {
//     mesh.params.petal.curveHeightEnd = mesh.params.petal.curveHeightStart + Math.max((waveLength - 65) / 10, 0)
//   })
// })