var params = require('./params')

module.exports = function gui(meshes) {
  var gui = new dat.GUI

  var theremin = gui.addFolder('Theremin')
    , proximity = gui.addFolder('Proximity Sensors')
    , potent = gui.addFolder('Potentiometers')
    , maybe = gui.addFolder('Maybe')
    , test = gui.addFolder('Test')
    , properties = {}

  theremin.open()
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

  function flowerVisible(number, total) {
    var visible

    if (total >= 4 || total === 1) {
      visible = number < total
    } else
    if (total === 3) {
      visible = number < 3
    } else
    if (total === 2) {
      visible = number && number < 3
    }

    return visible
  };

  /**
   * Theremin
   */
  addProp(theremin, 'growth', 0, 1.5, params.flower.growth)
    .name('Growth')
    .step(0.01)
    .onChange(update(function(goal, mesh, n) {
      mesh.params.flower.growth = goal
      if (!mesh.params.flower.visible) return
      mesh.params.timed.growthGoal = goal
    }))

  /**
   * Proximity Sensors
   */

  addProp(proximity, 'heightphase', -0.4, 0.4, 0)
    .name('Phase Speed')
    .step(0.01)
    .onChange(update(function(phase, mesh) {
      mesh.params.timed.heightPhaseSpeed = phase
    }))

  addProp(proximity, 'heightlength', -12, 12, 0)
    .name('Wavelength')
    .step(0.01)
    .onChange(update(function(waveLength, mesh) {
      mesh.params.petal.curveHeightEnd = mesh.params.petal.curveHeightStart + waveLength
    }))

  addProp(proximity, 'twirl', -2 * Math.PI, 2 * Math.PI, params.petal.twirl)
    .name('Twirl')
    .step(0.01)
    .onChange(updateUniforms('twirl'))

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

  addProp(potent, 'amplitude', 0, 120, params.petal.curveHeightScale)
    .name('Amplitude')
    .step(0.5)
    .onChange(updateUniforms('curveHeightScale'))

  /**
   * Maybe
   */
  addProp(maybe, 'twist', 0, Math.PI, params.flower.twist)
    .name('Twist')
    .step(0.01)
    .onChange(updateGeometry(function (twist, mesh) {
      mesh.params.flower.twist = twist
    }, 'update'))

  addProp(maybe, 'offset', 0, 2, params.timed.offset)
    .name('Disorder')
    .step(0.01)
    .onChange(update(function (offset, mesh) {
      mesh.params.timed.offset = offset
    }))

  addProp(maybe, 'flowers', 1, 4, 4)
    .name('Flowers')
    .step(1)
    .onChange(update(function(flowers, mesh, n) {
      mesh.params.flower.visible = flowerVisible(n, flowers)
      mesh.params.timed.growthGoal = mesh.params.flower.visible ? mesh.params.flower.growth : 0
    }))

};