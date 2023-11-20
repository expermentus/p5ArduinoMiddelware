import logging
import grpc
from concurrent import futures
import init_pb2, init_pb2_grpc
from flask import Flask, request
import time
import threading
from waitress import serve as waitress_serve

app = Flask(__name__)

@app.route('/wait_for_call', methods=['GET'])
def wait_for_call():
    print("Waiting for a REST API call...")

    # Simulate some processing (you can replace this with your actual logic)
    time.sleep(5)

    print("Received a REST API call!")

    # Return a response (you can customize this based on your needs)
    return "REST API call received and processed."


class init_servicer(init_pb2_grpc.FetchCredentialsServicer):
    def SetupArduinos(self, request, context):
        simon = 0
        print("1")
        print(request.arduino)

        choice = int(input("choose a device: "))

        ssid = input("ssid: ")
        password = input("password: ")
        devices = 1  # læs antal devices i database
        topic = f"IDIoT/device_{devices}"

        mqttun = "mqtt_username"
        mqttpw = "mqtt_password"

        return init_pb2.ChoiceAndCredentials(
            choice=choice,
            ssid=ssid,
            password=password,
            stopic=topic,
            mqttun=mqttun,
            mqttpw=mqttpw
        )



def serve_grpc():
    server = grpc.server(futures.ThreadPoolExecutor())
    init_pb2_grpc.add_FetchCredentialsServicer_to_server(
        init_servicer(), server)

    server.add_insecure_port("localhost:50050")
    server.start()
    print("gRPC server Listening on localhost:50050")
    server.wait_for_termination()

if __name__ == '__main__':
    # for debugging:
    logging.basicConfig()

    # Start Flask using Waitress in a separate thread
    waitress_thread = threading.Thread(target=waitress_serve, args=(app,), kwargs={'host': '127.0.0.1', 'port': 5000})
    waitress_thread.start()

    # Start gRPC in the main thread
    serve_grpc()

