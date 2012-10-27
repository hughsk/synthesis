var sp = require('serialport')
  , es = require('event-stream')
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
 .use(function (req, res) {
  res.end(JSON.stringify({
      url: req.url
    , status: 404
    , public: __dirname + '/../public'
    , root: require('fs').readdirSync(__dirname + '/../public')
  }, null, 2))
 })

server = http.createServer(app)
server.listen(process.env.PORT || 8080)

shoe(function clientStream(stream) {
  var through = es.through()

  function listener(data) {
    through.write(data)
  };

  arduino.on('data', listener)

  stream.on('end', function() {
    arudino.removeListener('data', listener)
    through.end()
  })

  through
    .pipe(stream)
}).install(server, '/flora')

arduino.on('data'
  , process.stdout.write.bind(process.stdout)
);