var params = require('./params')

module.exports = function gui(meshes) {
  var gui = new dat.GUI

  var proximity = gui.addFolder('Proximity Sensors')
    , potent = gui.addFolder('Potentiometers')
    , maybe = gui.addFolder('Maybe')
    , test = gui.addFolder('Test')
    , properties = {}

  proximity.open()
  potent.open()
  maybe.open()
  test.open()

  function addProp(folder, name, start, end, first) {
    properties[name] = first || 0
    return folder.add(properties, name, start, end)
  };

  function updateUniforms(key) {
    return function (value) {
      meshes.forEach(function(mesh) {
        mesh.material.uniforms[key].value = value
      })
    };
  };

  function updateGeometry(callback, method) {
    if (arguments.length < 2) {
      method = 'rebuild'
    }

    return function (value) {
      meshes.forEach(function(mesh, n) {
        callback.call(mesh, value, mesh, n)
        if (method) mesh[method]()
      })
    };
  };

  function update(callback) {
    return function (value) {
      meshes.forEach(function(mesh, n) {
        callback.call(mesh, value, mesh, n)
      })
    };
  };

  /**
   * Proximity Sensors
   */
  addProp(proximity, 'growth', 0, 1.5, params.flower.growth)
    .name('Growth')
    .step(0.01)
    .onChange(updateUniforms('growth'))

  addProp(proximity, 'heightphase', -0.4, 0.4, 0)
    .name('Height Phase Speed')
    .step(0.01)
    .onChange(update(function(phase, mesh) {
      mesh.params.timed.heightPhaseSpeed = phase
    }))

  /**
   * Potentiometers
   */
  addProp(potent, 'layers', 1, 20, params.flower.layers)
    .name('Layers')
    .step(0.05)
    .onChange(updateGeometry(function (layers, mesh) {
      mesh.params.flower.layers = layers
    }))

  addProp(potent, 'petals', 1, 20, params.flower.petals)
    .name('Petals')
    .step(1)
    .onChange(updateGeometry(function (petals, mesh) {
      mesh.params.flower.petals = petals
    }))

  /**
   * Maybe
   */
  addProp(maybe, 'twist', 0, Math.PI, params.flower.twist)
    .name('Twist')
    .step(0.01)
    .onChange(updateGeometry(function (twist, mesh) {
      mesh.params.flower.twist = twist
    }, 'update'))
};