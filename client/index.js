var shoe = require('shoe')
  , es = require('event-stream')
  , domready = require('domready')
  , EventEmitter = require('events').EventEmitter
  , flora = require('./flora.js')

// workaround for chrome bug:
// http://code.google.com/p/chromium/issues/detail?id=35980#c12
if ( window.innerWidth === 0 ) {
    window.innerWidth = parent.innerWidth;
    window.innerHeight = parent.innerHeight;
}

function ready() {
  var arduino = shoe('/flora')
    , split = es.split('\n')

  arduino
    .pipe(split)
    .on('data', function(data) {
      data = data.split(/\s+/g)
      if (data.length < 2) return

      flora.emit('change', data[0], data[1])
      flora.emit('change:'+data[0], data[1])
    })
};

if (!window.isStatic) {
  domready(ready)
}
