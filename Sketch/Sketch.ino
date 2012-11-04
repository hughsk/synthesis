/* Flora Arduino Code
 * ------------------ 
 *
 * Simply reads the value and prints it out,
 * each different variable being prefixed by
 * its name and a space, .e.g:
 *
 * d1 801
 * d2 523
 * d1 463
 * d1 312
 *
 * Could do the same with Firmata/johnny-five
 * but this is still pretty straightforward...
 */

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(getAnalog(2, "d2"));
  Serial.println(getAnalog(1, "d1"));
  delay(100);
}

String getAnalog(int pin, String prefix) {
  return prefix + " " + (String)analogRead(pin);
};
