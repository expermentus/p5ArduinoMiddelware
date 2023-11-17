
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>
#include "arduino_secrets.h"
#include <Arduino_MKRIoTCarrier.h>
MKRIoTCarrier carrier;

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = toilet;        // your network SSID (name)
char pass[] = børste;    // your network password (use for WPA, or use as key for WEP)
