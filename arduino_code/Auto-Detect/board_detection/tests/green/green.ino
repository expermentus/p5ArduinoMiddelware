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

#define NO_OTA_NETWORK
#include <ArduinoOTA.h> // only for InternalStorage

// Please enter your WiFi sensitive data in the arduino_secrets.h file
#include "arduino_secrets.h"

const short VERSION = 1;

const char MY_SSID[] = SECRET_SSID; // Loaded from arduino_secrets.h
const char MY_PASS[] = SECRET_PASS; // Loaded from arduino_secrets.h


//WiFiClient    wifiClient;  // HTTP
WiFiSSLClient wifiClientSSL;  // HTTPS
MKRIoTCarrier carrier;
int status = WL_IDLE_STATUS;

WiFiServer server(80);  // Use a port number that is not conflicting with other services

void handleSketchDownload(WiFiClient& clientt) {
  const char* SERVER = "p5test.blob.core.windows.net";  // Set your correct hostname
  const unsigned short SERVER_PORT = 443;     // Commonly 80 (HTTP) | 443 (HTTPS)
  const char* PATH = "/binfiles/red.ino.bin";  // Set the URI to the .bin firmware
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
          // Respond to the client
  clientt.println("HTTP/1.1 200 OK");
  clientt.println("Content-Type: text/html");
  clientt.println();
  clientt.println("<h1>Update Triggered!</h1>");

        // Close the connection
  clientt.stop();
  Serial.flush();
  InternalStorage.apply(); // this doesn't return
  Serial.println("done");

}

void setup() {

  Serial.begin(115200);
  while (!Serial);

  Serial.print("Sketch version ");
  Serial.println(VERSION);

  Serial.println("Initialize WiFi");
  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(MY_SSID);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(MY_SSID, MY_PASS);
  }
  Serial.println("WiFi connected");
  Serial.print("WiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
  carrier.begin();
  carrier.display.fillScreen(0x07E0); // green

  server.begin();  // Start the server
  Serial.println("Server started");

}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New client connected");

    // Wait for the client to send data
    while (client.connected()) {
      if (client.available()) {
        // Read the data sent by the client
        String command = client.readStringUntil('\r');
        command.trim();
        
        // Check for the update command
        if (command == "update") {
          handleSketchDownload(client);
        }

        // Respond to the client
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/html");
        client.println();
        client.println("<h1>Update Triggered!</h1>");

        // Close the connection
        client.stop();
        Serial.println("Client disconnected");
        break;
      }
    }
  }

  // add your normal loop code below ...
}