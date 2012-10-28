var EventEmitter = require('events').EventEmitter

var flora = module.exports = new EventEmitter
  , FlowerObject = require('./lib/flower-object.js')

var camera
  , scene
  , renderer
  , mesh

init();
animate();

function init() {
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

    renderer.setSize( window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );
};

function animate() {
    requestAnimationFrame( animate );
    render();
};

function render() {

    // mesh.rotation.y = Date.now() * 0.0007;
    // mesh.flowerMaterial.uniforms.growth.value = (Math.sin(Date.now() * 0.001) + 1) * 0.6;
    // mesh.flowerMaterial.uniforms.twirl.value = (Math.sin(Date.now() * 0.001) + 1) * 0.5;

    renderer.render( scene, camera );
};