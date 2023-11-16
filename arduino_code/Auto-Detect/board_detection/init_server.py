import logging

import grpc
from concurrent import futures
import init_pb2, init_pb2_grpc


class init_servicer(init_pb2_grpc.FetchCredentialsServicer):
    def SetupArduinos(self, request, context):
        print("1")
        for i in range(len(request)):
            print(i, request[i])
        print("2")
        choice = input("choose a device: ")
        ssid = input("ssid: ")
        password = input("password: ")
        devices = 1  # læs antal devices i database
        topic = f"IDIoT/device_{devices}"

        mqttun = "mqtt_username"
        mqttps = "mqtt_password"

        return init_pb2.ChoiceAndCredentials(
            choice=choice,
            ssid=ssid,
            password=password,
            stopic=topic,
            mqttun=mqttun,
            mqttps=mqttps
        )


def serve():  # creates a server that can handle multiple threads
    server = grpc.server(futures.ThreadPoolExecutor())
    init_pb2_grpc.add_FetchCredentialsServicer_to_server(
        init_servicer(), server)

    server.add_insecure_port("localhost:50050")
    server.start()
    print("Listening on localhost:50050")
    server.wait_for_termination()


if __name__ == '__main__':
    # for debugging:
    logging.basicConfig()
    serve()
