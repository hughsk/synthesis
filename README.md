# flora

Very much work-in-progress-not-properly-named project for my studies. Totally
dependant on:

* [event-stream](http://npm.im/event-stream)
* [browserify](http://npm.im/browserify)
* [serialport](http://npm.im/serialport)
* [three.js](http://mrdoob.github.com/three.js/)
* [connect](http://npm.im/connect)
* [shoe](http://npm.im/shoe)

Plus a few extras, and a good old [Arudino](http://arduino.cc) for input (it
still runs without though).

## Setup

Clone the repo and dependencies:

``` bash
$ git clone git@github.com:hughsk/flora.git
$ cd flora
$ npm install
```

Build the client-side files and start up the server:

``` bash
$ npm start
```

If you've got an Arduino handy, load up the script in
[FloraSketch](https://github.com/hughsk/flora/tree/master/FloraSketch). Then get
some input on A2 and set the serial port to match:

``` bash
$ SERIAL='/dev/tty.usbmodemfa131' npm start
```
