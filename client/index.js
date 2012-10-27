var shoe = require('shoe')
  , es = require('event-stream')
  , domready = require('domready')
  , EventEmitter = require('events').EventEmitter

var trigger = new EventEmitter

trigger.on('change', function(key, value) {
  console.log([key, value])
});

domready(function ready() {
  var arduino = shoe('/flora')
    , split = es.split('\n')

  arduino
    .pipe(split)
    .on('data', function(data) {
      data = data.split(/\s+/g)
      if (data.length < 2) return

      trigger.emit('change', data[0], data[1])
    })
})