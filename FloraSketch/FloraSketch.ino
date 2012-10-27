/* Flora Arduino Code
 * ------------------ 
 *
 * Reads from a potentiometer, at the moment.
 * 
 * Simply reads the value and prints it out,
 * each different variable being prefixed by
 * its name and a space, .e.g:
 *
 * d1 801
 * d2 523
 * d1 463
 * d1 312
 */

int potentiometer = 2;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(getPotentiometer(potentiometer, "d1"));  
  delay(100);
}

String getPotentiometer(int pin, String prefix) {
  return prefix + " " + (String)analogRead(pin);
};
