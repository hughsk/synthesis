var EventEmitter = require('events').EventEmitter

var flora = module.exports = new EventEmitter

flora.PetalGeometry = require('./lib/petal-geometry.js')

flora.shaders = {
    petalVert: document.getElementById('petal-vertex').innerHTML
  , petalFrag: document.getElementById('petal-fragment').innerHTML
};

var camera
  , scene
  , renderer
  , geometry
  , material
  , mesh

function FlowerMaterial(params, geometry) {
    return new THREE.ShaderMaterial({
          vertexShader: flora.shaders.petalVert
        , fragmentShader: flora.shaders.petalFrag
        , wireframe: params.flower.wireframe
        , attributes: {
            xpos: {
                  type: 'f'
                , value: geometry.data.lengths
            }
            , widths: {
                  type: 'f'
                , value: geometry.data.widths
            }
        }
        , uniforms: {
            curveHeightStart: {
                type: 'f', value: params.petal.curveHeightStart
            }
            , curveHeightEnd: {
                type: 'f', value: params.petal.curveHeightEnd
            }
            , curveHeightScale: {
                type: 'f', value: params.petal.curveHeightScale
            }
            , curveWidthStart: {
                type: 'f', value: params.petal.curveWidthStart
            }
            , curveWidthEnd: {
                type: 'f', value: params.petal.curveWidthEnd
            }
            , curveWidthScale: {
                type: 'f', value: params.petal.curveWidthScale
            }
            , lightness: {
                type: 'f', value: params.flower.lightness
            }
            , redness: {
                type: 'f', value: params.flower.redness
            }
            , greeness: {
                type: 'f', value: params.flower.greeness
            }
            , blueness: {
                type: 'f', value: params.flower.blueness
            }
            , lines: {
                type: 'f', value: params.flower.lines
            }
            , lineDarkness: {
                type: 'f', value: params.flower.lineDarkness
            }
            , growth: {
                type: 'f', value: params.flower.growth
            }
            , twirl: {
                type: 'f', value: params.flower.twirl
            }
            , dirtiness: {
                type: 'f', value: params.flower.dirtiness
            }
            , border: {
                type: 'f', value: params.flower.border
            }
            , borderSize: {
                type: 'f', value: params.flower.borderSize
            }
        }
    });
};

function FlowerParams() {
    var params = {};

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
        , dirtiness: 0.05
        , border: 0.4
        , borderSize: 0.1
        , wireframe: false
    };

    return params;
};

flora.FlowerObject = function() {
    THREE.Object3D.call(this);

    this.flowerGeometry = new flora.PetalGeometry();
    this.flowerParams = FlowerParams();

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

var nextGrowth = 0

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

    flora.on('change:d1', function(value) {
        nextGrowth = nextGrowth + (value - nextGrowth) * 0.01
    })

    document.body.appendChild( renderer.domElement );
};

function animate() {
    requestAnimationFrame( animate );
    render();
};

function render() {

    mesh.rotation.y = Date.now() * 0.0007;
    mesh.flowerMaterial.uniforms.growth.value = nextGrowth / 850;

    renderer.render( scene, camera );
};