import re
import grpc
from detection import check_ports
from compiler import Compiler
from generate_init import generate_init
import init_pb2, init_pb2_grpc


def upload(stub):
    arduinos, notarduinos = check_ports()

    if len(arduinos) == 0:
        arduinos.append("Arduino Uno WiFi Rev2")
        print("1")
    print("2")
    arduino = arduinos[0]
    response = stub.SetupArduinos(init_pb2.Arduinos(arduino=arduino))

    SSID = response.ssid
    Password = response.password
    stopic = response.stopic
    mqttun = response.mqttun
    mqttps = response.mqttps

    generate_init("test", SSID=SSID, Password=Password, stopic=stopic, mqttun=mqttun, mqttps=mqttps)

    arduino_name = arduinos[response.choice + 1]
    arduino_port = ''
    while 1:
        if len(arduinos) == 0:
            break
        selected = response.choice

        try:
            arduino = arduinos[selected - 1]
            arduino_name = str(re.sub(r"['\[\]]", "", arduino[0][0]))
            arduino_port = str(arduino[1][0])
            break

        except IndexError:
            print("index out of range")

    dump_path = f'tests/sketch'

    compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
                        sketch_path=dump_path,
                        board=arduino_name,
                        COM_PORT=arduino_port,
                        )

    compiler.compile()

    # os.remove('dump_path')


def run():
    # channel = "???" #TODO uhm what channel :D?
    with grpc.insecure_channel("localhost:50050") as channel:
        # grpc stub:
        stub = init_pb2_grpc.FetchCredentialsStub(channel)
        upload(stub)
        channel.close()


# Running the client
if __name__ == "__main__":
    run()
