/* Sensor Arduino Code
 * -------------------
 *
 * Simply reads the value and prints it out, .e.g:
 *
 * d0:801  p0:523  ...
 * d0:463  p0:312  ...
 *
 * Could do the same with Firmata/johnny-five
 * but this is super trivial...
 */

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Proximity Sensors
  Serial.print(getAnalog(0, "p0"));
  Serial.print(getAnalog(1, "p1"));
  Serial.print(getAnalog(3, "p2"));
  Serial.print(getAnalog(4, "p3"));
  Serial.print(getAnalog(5, "p5"));

  // Potentiometers
  Serial.print(getAnalog(15, "d0"));
  Serial.print(getAnalog(14, "d1"));
  Serial.print(getAnalog(13, "d2"));
  Serial.print(getAnalog(12, "d3"));

  Serial.println("");
  delay(120);
}

String getAnalog(int pin, String prefix) {
  return prefix + ":" + (String)analogRead(pin) + "\t";
};
