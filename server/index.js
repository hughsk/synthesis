var sp = require('serialport')
  , es = require('event-stream')
  , Stream = require('stream')
  , http = require('http')
  , shoe = require('shoe')
  , connect = require('connect')

var arduino = new sp.SerialPort('/dev/tty.usbmodemfa131', {})
  , app = connect()
  , server

app
 .use(connect.logger('dev'))
 .use(connect.static(__dirname + '/../public'))
 .use(connect.directory(__dirname + '/../public'))

server = http.createServer(app)
server.listen(process.env.PORT || 8080)

shoe(function clientStream(stream) {
  var through = es.through()

  function listener(data) {
    through.write(data)
  };

  arduino.on('data', listener)

  stream.on('end', function() {
    arduino.removeListener('data', listener)
    through.end()
  })

  through
    .pipe(stream)
}).install(server, '/flora')

/**
 * Debug logging of serial port output
 */
function watchData(emitter) {
  if (!process.env.LOG) return
  emitter.on('data'
    , process.stdout.write.bind(process.stdout)
  );
};
watchData(arduino)

/**
 * If unable to connect to an Arduino,
 * serve up some dummy data.
 */
arduino.once('error', function(err) {
  if (!/Cannot open/gi.test(err.message)) throw err
  
  var time = 0

  console.log('')
  console.log('WARNING:', err.message)
  console.log('Difficulties connecting to Arudino\'s serial port...')
  console.log('')
  console.log('Ensure you have the correct serial port set, and in')
  console.log('the meantime here\'s some dummy data.')
  console.log('')

  arduino = new Stream

  setInterval(function() {
    var data = 'd1'

    data += ' '
    data += Math.floor(512 * (Math.sin(time) + 1))
    data += '\n'

    arduino.emit('data', data)
    time += 0.0221
  }, 50)

  watchData(arduino)
})