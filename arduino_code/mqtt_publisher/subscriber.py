import paho.mqtt.client as mqtt
import mysql.connector

connection = mysql.connector.connect(
    host="130.225.39.23",
    user="p5",
    password="root",
    database="IdIoT_Middleware",
    charset="utf8mb4"
)

cursor = connection.cursor()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe("#")  # Subscribe to all topics using the # wildcard
    else:
        print(f"Failed to connect to MQTT broker with result code {rc}")

def on_message(client, userdata, msg):
    device = msg.topic.split("/")
    print(device)
    findID = "SELECT id FROM devices WHERE topic = %s"
    cursor.execute(findID, (device[0]))

    deviceID = cursor.fetchone()

    storeData = "INSERT INTO sensor_data (device_id, data_name, reading) VALUES (%s, %s, %s)"
    values = (deviceID[0], device[2], int(msg.payload.decode('utf-8')))
    cursor.execute(storeData, values)

    connection.commit()

    print(f"Received message on topic: {msg.topic}\nPayload: {msg.payload.decode('utf-8')}")

# Replace these values with your MQTT broker details
broker_address = "130.225.37.228"
port = 1883
client_id = "AllTopicsSubscriber"
username = "mqtt"
password = "idiot"

client = mqtt.Client(client_id)
client.username_pw_set(username, password)  # Set the username and password
client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_address, port, 60)
client.loop_start()  # Use loop_start to allow the script to continue executing

try:
    while True:
        pass
except KeyboardInterrupt:
    print("Disconnecting from MQTT broker...")
    client.loop_stop()
    client.disconnect()
    connection.close()