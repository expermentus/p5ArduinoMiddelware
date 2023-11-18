import re
import os
from detection import check_ports
from compiler import Compiler
from generate_init_header import generate_header_file
from send_json import send_json

def SetupArduinos():
    arduinos, notarduinos = check_ports()

    if len(arduinos) == 0:
        arduinos.append(["Arduino Uno WiFi Rev2", "COM0"])
        arduinos.append(['Arduino Micro', 'COM99'])

    arduino = arduinos[0][0]

    send_json(arduinos)

    #SSID = response.ssid
    #Password = response.password
    #stopic = response.stopic
    #mqttun = response.mqttun
    #mqttpw = response.mqttpw

    #generate_header_file('init_sketch/arduino_secrets.h', SSID, Password, stopic, mqttun, mqttpw)

    #arduino_name = arduinos[response.choice - 1]
    #arduino_port = ''
    #while 1:
    #    if len(arduinos) == 0:
    #        break
    #    selected = response.choice

    #    try:
    #        arduino = arduinos[selected - 1]
    #        arduino_name = str(re.sub(r"['\[\]]", "", arduino[0][0]))
    #        arduino_port = str(arduino[1][0])
    #        break

    #    except IndexError:
    #        print("index out of range")

    #compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
    #                    sketch_path='init_sketch',
    #                    board=arduino_name,
    #                    COM_PORT=arduino_port,
    #                    )

    # compiler.compile()

    # os.remove('dump_path')


def run():
    SetupArduinos()

# Running the client
if __name__ == "__main__":
    run()
