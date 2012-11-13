var params = require('./params')
  , raf = require('./raf')
  , EventEmitter = require('events').EventEmitter

module.exports = function gui(meshes) {
  var gui = new dat.GUI

  var theremin = gui.addFolder('Theremin')
    , proximity = gui.addFolder('Proximity Sensors')
    , potent = gui.addFolder('Potentiometers')
    , maybe = gui.addFolder('Maybe')
    , test = gui.addFolder('Test')
    , properties = new EventEmitter
    , rounded = {
      petals: true
    }

  gui.remember(properties)

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

  addProp(proximity, 'twirlSpeed', 0, 1, params.timed.twirlSpeed)
    .name('Twirl Speed')
    .step(0.01)

  properties.on('change:twirlSpeed', update(function(speed, mesh) {
    mesh.params.timed.twirlSpeed = speed
  }))

  addProp(proximity, 'spreadOffsetSpeed', 0, 5, params.flower.spreadOffset)
    .name('Spread Offset')
    .step(0.01)

  properties.on('change:spreadOffsetSpeed', updateGeometry(function(offset, mesh) {
    mesh.params.timed.spreadOffsetSpeed = offset
  }))

  addProp(proximity, 'spread', 0, 5, params.flower.spread)
    .name('Spread')
    .step(0.01)

  properties.on('change:spread', updateGeometry(function(spread, mesh) {
    mesh.params.flower.spread = spread
  }))

  addProp(proximity, 'curveWidth', 0, 6 * Math.PI, params.flower.curveWidthStart)
    .name('Curve Width')
    .step(0.01)

  properties.on('change:curveWidth', updateUniforms('curveWidthStart'))

  /**
   * Potentiometers
   */
  addProp(potent, 'layers', 1, 20, params.flower.layers)
    .name('Layers')
    .step(0.05)
  
  properties.on('change:layers', updateGeometry(function (layers, mesh) {
    mesh.params.flower.layers = layers
  }))

  addProp(potent, 'petals', 1, 20, params.flower.petals)
    .name('Petals')
    .step(1)

  properties.on('change:petals', updateGeometry(function (petals, mesh) {
    mesh.params.flower.petals = petals
  }))

  addProp(potent, 'hue', 0, 3, params.timed.hueProgress)
    .name('Hue')
    .step(0.01)

  properties.on('change:hue', updateGeometry(function (hue, mesh) {
    mesh.params.timed.hueProgress = hue * 180
  }))

  addProp(potent, 'width', 1, 200, params.petal.curveHeightScale)
    .name('Width')
    .step(0.25)

  properties.on('change:width', update(function(width, mesh) {
    mesh.params.petal.curveWidthScale = width
  }))

  addProp(potent, 'amplitude', 0, 120, params.petal.curveHeightScale)
    .name('Amplitude')
    .step(0.5)
  
  properties.on('change:amplitude', updateUniforms('curveHeightScale'))

  /**
   * Maybe
   */
  addProp(maybe, 'twist', 0, Math.PI, params.flower.twist)
    .name('Twist')
    .step(0.01)

  properties.on('change:twist', updateGeometry(function (twist, mesh) {
    mesh.params.flower.twist = twist
  }, 'update'))

  addProp(maybe, 'offset', 0, 2, params.timed.offset)
    .name('Disorder')
    .step(0.01)

  properties.on('change:offset', update(function (offset, mesh) {
    mesh.params.timed.offset = offset
  }))

  addProp(maybe, 'flowers', 1, 4, 4)
    .name('Flowers')
    .step(1)
    .onChange(update(function(flowers, mesh, n) {
      mesh.params.flower.visible = flowerVisible(n, flowers)
      mesh.params.timed.growthGoal = mesh.params.flower.visible ? mesh.params.flower.growth : 0
    }))

  /**
   * Automatically tween properties when modified
   */
  Object.keys(properties).forEach(function(property) {
    var current = properties[property]
      , target = current
      , updating = false

    function updater() {
      var diff

      if (current === target) {
        updating = false
        return
      }

      diff = Math.abs(current - target)

      if (rounded[property]) {
        current = Math[
          target > current ? 'ceil' : 'floor'
        ](current + (target - current) * 0.5)
      } else {
        current = current + (target - current) * 0.05
      }

      properties.emit('change', property, current)
      properties.emit('change:'+property, current)

      if (diff < 0.005) current = target

      raf(updater)
    };

    properties.__defineGetter__(property, function() {
      return current
    })

    properties.__defineSetter__(property, function(val) {
      target = val

      if (!updating) {
        updating = true
        updater()
      }
    });
  })

  gui.properties = properties
  gui.domElement.style.display = 'none'

  return gui
};