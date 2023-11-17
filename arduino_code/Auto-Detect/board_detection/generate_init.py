import os
from everywhereml.arduino import Sketch, Ino, H


def generate_init(name, SSID, Password, stopic, mqttun, mqttpw):
    # elegant code to seamlessly import variables in .ino code

    sketch = Sketch(name=name, folder=os.path.abspath('tests'))

    # Code to add to the sketch:

    sketch += Ino(f"""
    #include <ArduinoMqttClient.h>
    #include <WiFiNINA.h>
    #include "arduino_secrets.h"
    #include <Arduino_MKRIoTCarrier.h>
    MKRIoTCarrier carrier;
    
    ///////please enter your sensitive data in the Secret tab/arduino_secrets.h
    char ssid[] = SECRET_SSID;        // your network SSID (name)
    char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
    char stopic[] = SECRET_STOPIC;
    char mqttun[] = SECRET_MQTTUN;
    char mqttpw[] = SECRET_MQTTPW;
    
    NOT DONE!!!!!!!!!!!!!!
    
    """)
