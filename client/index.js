var shoe = require('shoe')
  , es = require('event-stream')
  , domready = require('domready')

domready(function ready() {
  var arduino = shoe('/flora')
    , split = es.split('\n')

  arduino
    .pipe(split)
    .on('data', console.log.bind(console))
})