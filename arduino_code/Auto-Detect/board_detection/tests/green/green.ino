
#include <WiFiNINA.h>
#include <Arduino_MKRIoTCarrier.h>
MKRIoTCarrier carrier;

void setup() {
  carrier.begin();
  carrier.display.fillScreen(0x07E0); // green
  }

void loop() {

}
