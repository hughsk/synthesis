var sp = require('serialport')
  , es = require('event-stream')
  , Stream = require('stream')
  , http = require('http')
  , shoe = require('shoe')
  , connect = require('connect')

var serials = (process.env.SERIAL || '/dev/tty.usbmodemfa131,/dev/tty.usbmodemfd121,/dev/ttyACM0,/dev/ttyACM1').split(',')
  , port = process.env.PORT || 8080
  , app = connect()
  , server
  , arduinos

arduinos = serials.map(function(serial) {
  return new sp.SerialPort(serial, {})
})

console.log('Serial ports:', serials)
console.log('Server port:', port)

app
 .use(connect.logger('dev'))
 .use(connect.static(__dirname + '/../public'))
 .use(connect.directory(__dirname + '/../public'))

server = http.createServer(app)
server.listen(port)

shoe(function clientStream(stream) {
  var through = es.through(function(data) {
    this.emit('data', data + '\n')
  })

  arduinos.forEach(function(arduino) {
    var split = es.split('\n')

    function listener(data) {
      split.write(data)
    };

    split.pipe(through)

    arduino.on('data', listener)

    stream.on('end', function() {
      arduino.removeListener('data', listener)
      through.end()
    })
  })

  through.pipe(stream)
}).install(server, '/flora')
