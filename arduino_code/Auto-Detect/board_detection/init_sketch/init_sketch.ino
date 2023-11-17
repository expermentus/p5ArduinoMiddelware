#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>
#include "arduino_secrets.h"
#include <Arduino_MKRIoTCarrier.h>
MKRIoTCarrier carrier;

void setup() {
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
char stopic[] = SECRET_STOPIC;
char mqttun[] = SECRET_MQTTUN;
char mqttpw[] = SECRET_MQTTPW;
  carrier.begin();
  carrier.display.fillScreen(0xF800); // red
  }

void loop() {

}
