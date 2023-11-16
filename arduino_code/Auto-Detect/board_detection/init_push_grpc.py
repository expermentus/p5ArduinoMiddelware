import re
import grpc
from detection import check_ports
from compiler import Compiler
from generate_init import generate_init
from grpc_stuff import init_pb2, init_pb2_grpc
arduinos, notarduinos = check_ports()

# channel = "???" #TODO uhm what channel :D?

channel = "localhost:55555"

# grpc stub:
stub = init_pb2_grpc.FetchCredentialsStub(channel)

for i in range(len(arduinos)):
    print("Boards:")
    print(i + 1, ":", arduinos[i][0], arduinos[i][1])

arduinos_to_send = init_pb2.Arduinos(Arduino=arduinos[0])
SSID, Password = '', ''

generate_init("test", SSID, Password)

arduino_name = ''
arduino_port = ''
while 1:
    if len(arduinos) == 0:
        break
    selected = int(input("Select board: "))

    try:
        arduino = arduinos[selected - 1]
        arduino_name = str(re.sub(r"['\[\]]", "", arduino[0][0]))
        arduino_port = str(arduino[1][0])
        break

    except IndexError:
        print("index out of range")

compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
                    sketch_path='tests/red',
                    board=arduino_name,
                    COM_PORT=arduino_port,
                    )

compiler.compile()
