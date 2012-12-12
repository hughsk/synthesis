# Synthesis

![Synthesis](https://raw.github.com/hughsk/synthesis/master/images/projected.jpg)

Open sourcing the code for my graduation project because why not. It's an
interactive installation - a 3D visualisation of four flowers, and 95%
JavaScript. (The rest is handled by 2 Arduinos.)

You can find a [demo here](http://hughsk.github.com/synthesis/public),
and a [video here](https://vimeo.com/55429251). But the other half is
the interface, or "instrument", this cobbled together thing:

![Instrument](https://raw.github.com/hughsk/synthesis/master/images/instrument.jpg)

For the curious: the wire bit on the side is a
**Capacitive [Theremin](http://www.youtube.com/watch?v=w5qf9O6c20o)**,
put together using [this guide](http://interface.khm.de/index.php/lab/experiments/theremin-as-a-capacitive-sensing-device/).
The end result is that the flowers grow from nothing, the closer you move your
hand to the wire.

There's also 5 [infrared proximity sensors](http://littlebirdelectronics.com/products/infrared-proximity-sensor-short-range-sharp-gp2d120xj00f) and 4
potentiometers that control the other parameters mapped out in the demo.

I might end up putting some more details on the process/setup here, but for now
that's it :)

It's totally dependent on these modules/libraries, among others:

* [three.js](http://mrdoob.github.com/three.js/)
* [dat.gui](http://workshop.chromeexperiments.com/examples/gui/)
* [event-stream](http://npm.im/event-stream)
* [browserify](http://npm.im/browserify)
* [serialport](http://npm.im/serialport)
* [shoe](http://npm.im/shoe)

So thanks go to the authors for making the black boxes that made this a lot
less mind-boggling to put together.
