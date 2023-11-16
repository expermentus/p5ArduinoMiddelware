/*

  This example downloads sketch update over WiFi network.
  You can choose between HTTP and HTTPS connection.
  In HTTPS case, remember to flash the server root CA certificate
  using WiFi101/WiFiNINA updater tool.
  It doesn't start the OTA upload sever of the ArduinoOTA library,
  it only uses the InternalStorage object of the library
  to store and apply the downloaded binary file.

  To create the bin file for update of a SAMD board (except of M0),
  use in Arduino IDE command "Export compiled binary".
  To create a bin file for AVR boards see the instructions in README.MD.
  To try this example, you should have a web server where you put
  the binary update.
  Modify the constants below to match your configuration.

  Created for ArduinoOTA library in December 2020
  by Nicola Elia
  based on Juraj Andrassy sample sketch 'OTASketchDownload'
*/

#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <Arduino_MKRIoTCarrier.h>
#include <ArduinoMqttClient.h>

#define NO_OTA_NETWORK
#include <ArduinoOTA.h> // only for InternalStorage

// Please enter your WiFi sensitive data in the arduino_secrets.h file
#include "arduino_secrets.h"

const short VERSION = 1;

const char ssid[] = SECRET_SSID; // Loaded from arduino_secrets.h
const char pass[] = SECRET_PASS; // Loaded from arduino_secrets.h
const char mqttServer[] = "test.mosquitto.org";
const int mqttPort = 1883;
const char topic[]  = "ota_first_topic";

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

//WiFiClient    wifiClient;  // HTTP
WiFiSSLClient wifiClientSSL;  // HTTPS
MKRIoTCarrier carrier;
int status = WL_IDLE_STATUS;

WiFiServer server(80);  // Use a port number that is not conflicting with other services

void handleSketchDownload(const char* PATH) {
  const char* SERVER = "p5test.blob.core.windows.net";  // Set your correct hostname
  const unsigned short SERVER_PORT = 443;     // Commonly 80 (HTTP) | 443 (HTTPS)
  //const char* PATH = "/binfiles/red.ino.bin";  // Set the URI to the .bin firmware
  const unsigned long CHECK_INTERVAL = 20000;  // Time interval between update checks (ms)

  // Time interval check
  static unsigned long previousMillis;
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis < CHECK_INTERVAL)
    return;
  previousMillis = currentMillis;

  //HttpClient client(wifiClient, SERVER, SERVER_PORT);  // HTTP
  HttpClient client(wifiClientSSL, SERVER, SERVER_PORT);  // HTTPS

  char buff[100];
  snprintf(buff, sizeof(buff), PATH, VERSION + 1);

  Serial.print("Check for update file ");
  Serial.println(buff);

  // Make the GET request
  client.get(buff);

  int statusCode = client.responseStatusCode();
  Serial.print("Update status code: ");
  Serial.println(statusCode);
  if (statusCode != 200) {
    client.stop();
    return;
  }

  long length = client.contentLength();
  if (length == HttpClient::kNoContentLengthHeader) {
    client.stop();
    Serial.println("Server didn't provide Content-length header. Can't continue with update.");
    return;
  }
  Serial.print("Server returned update file of size ");
  Serial.print(length);
  Serial.println(" bytes");

  if (!InternalStorage.open(length)) {
    client.stop();
    Serial.println("There is not enough space to store the update. Can't continue with update.");
    return;
  }
  byte b;
  while (length > 0) {
    if (!client.readBytes(&b, 1)) // reading a byte with timeout
      break;
    InternalStorage.write(b);
    length--;
  }
  InternalStorage.close();
  client.stop();

  if (length > 0) {
    Serial.print("Timeout downloading update file at ");
    Serial.print(length);
    Serial.println(" bytes. Can't continue with update.");
    return;
  }

  Serial.println("Sketch update apply and reset.");

  Serial.flush();
  InternalStorage.apply(); // this doesn't return
  Serial.println("done");

}

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(mqttServer);

  if (!mqttClient.connect(mqttServer, mqttPort)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  // set the message receive callback
  mqttClient.onMessage(onMqttMessage);

  Serial.print("Subscribing to topic: ");
  Serial.println(topic);
  Serial.println();

  // subscribe to a topic
  mqttClient.subscribe(topic);

  Serial.print(topic);

}

void loop() {
  mqttClient.poll();

}

void onMqttMessage(int messageSize) {
  // we received a message, print out the topic and contents
  Serial.println("Received a message with topic '");
  Serial.print(mqttClient.messageTopic());
  Serial.print("', length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

  // use the Stream interface to print the contents
  while (mqttClient.available()) {
    //char[] trigger = "simon"
    //char[] test = mqttClient.readString()
    if(mqttClient.messageTopic()=="ota_first_topic"){
      handleSketchDownload(mqttClient.readString().c_str());
    }

  }
  Serial.println();
  Serial.println();
}
