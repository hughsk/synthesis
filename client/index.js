var shoe = require('shoe')
  , es = require('event-stream')
  , domready = require('domready')
  , EventEmitter = require('events').EventEmitter

var trigger = new EventEmitter

trigger.on('change:d1', function(key) {
  console.log(['d1', value])
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
      trigger.emit('change:'+data[0], data[1])
    })
})
