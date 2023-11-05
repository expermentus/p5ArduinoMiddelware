#include <WiFiNINA.h>
#include <Arduino_MKRIoTCarrier.h>

MKRIoTCarrier carrier;

void setup() {
  carrier.begin();
  carrier.display.fillScreen(0xF800); // red
  }

void loop() {

}