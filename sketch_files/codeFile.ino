
  #include <WiFiNINA.h>
  #include <Arduino_MKRIoTCarrier.h>
  #define NO_OTA_NETWORK
  #include <ArduinoOTA.h> // only for InternalStorage
  #include <ArduinoHttpClient.h>
  #include <PubSubClient.h>
  #include "arduino_secrets.h"


  const short VERSION = 1;

  const char MY_SSID[] = SECRET_SSID; // Loaded from arduino_secrets.h
  const char MY_PASS[] = SECRET_PASS; // Loaded from arduino_secrets.h
  const char otatopic[] = SECRET_STOPIC; // Loaded from arduino_secrets.h
  const char broker[] = SECRET_BROKER; // Loaded from arduino_secrets.h
  int        port     = SECRET_PORT; // Loaded from arduino_secrets.h
  const char username[] = SECRET_UN; // Loaded from arduino_secrets.h
  const char password[] = SECRET_PW; // Loaded from arduino_secrets.h

  WiFiClient    wifiClient;  // HTTP
  WiFiSSLClient wifiClientSSL;  // HTTPS
  MKRIoTCarrier carrier;

  PubSubClient mqttClient(wifiClient);


  void handleSketchDownload(char PATH[]) {
    const char* SERVER = "p5test.blob.core.windows.net";  // Set your correct hostname
    const unsigned short SERVER_PORT = 443;     // Commonly 80 (HTTP) | 443 (HTTPS)
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
    Serial.flush();
    InternalStorage.apply(); // this doesn't return
    Serial.println("done");
  }

  void setup() {

    //Initialize serial and wait for port to open:
    Serial.begin(9600);

    // attempt to connect to Wifi network:
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(MY_SSID);
    while (WiFi.begin(MY_SSID, MY_PASS) != WL_CONNECTED) {
      // failed, retry
      Serial.print(".");
      delay(5000);
    }

    Serial.println("You're connected to the network");
    Serial.println();

    Serial.print("Attempting to connect to the MQTT broker: ");
    Serial.println(broker);

      // Configure MQTT broker
    mqttClient.setServer(broker, port);
    mqttClient.setCallback(callback);

    if (!mqttClient.connect("arduino", username, password)) {
      Serial.print("MQTT connection failed! Error code = ");
      Serial.println(mqttClient.state());

      while (1);
    }

    Serial.println("You're connected to the MQTT broker!");
    Serial.println();


    Serial.print("Subscribing to topic: ");
    Serial.println(otatopic);
    Serial.println();

    // subscribe to a topic
    mqttClient.subscribe(otatopic);


    // topics can be unsubscribed using:
    // mqttClient.unsubscribe(topic);

    Serial.print("Topic: ");
    Serial.println(otatopic);

    Serial.println();
    carrier.begin();
    carrier.display.fillScreen(0xFBC0); // green

  }

  void loop() {
    mqttClient.loop();
  }

  void callback(char* topic, byte* payload, unsigned int length) {
    // we received a message, print out the topic and contents
    Serial.println("Received a message with topic '");
    Serial.print(topic);
    Serial.print("', length ");
    Serial.print(length);
    Serial.println(" bytes:");

    Serial.print("Payload: ");
    char messageBuffer[length - 1];


    for (int i = 0; i < length; i++) {
      messageBuffer[i] = (char)payload[i];
    }
    messageBuffer[length] = '\0';



    // Call the function and pass the message buffer
    handleSketchDownload(messageBuffer);


  }
    