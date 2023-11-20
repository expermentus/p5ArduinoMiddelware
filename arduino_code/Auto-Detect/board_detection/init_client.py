import re, os
from detection import check_ports
from compiler import Compiler
from generate_init_header import generate_header_file
from send_recieve_json import send_json, receive_json


def SetupArduinos():
    arduinos, notarduinos = check_ports()

    if len(arduinos) == 0:
        print('No arduinos found')

    send_json(arduinos)

    data = receive_json()

    print('1: ', data['choice'])
    print('2: ', data['ssid'])
    print('3: ', data['password'])
    print('4: ', data['stopic'])
    print('5: ', data['mqttun'])
    print('6: ', data['mqttpw'])

    generate_header_file('init_sketch/arduino_secrets.h',
                         data['ssid'],
                         data['password'],
                         data['stopic'],
                         data['mqttun'],
                         data['mqttpw'])
    choice = None

    try:
        choice = int(data['choice'])
    except ValueError:
        print("Choice must be a number (integer).")

    arduino = arduinos[choice - 1]
    arduino_name = ''
    arduino_port = ''

    while 1:
        if len(arduinos) == 0:
            break

        try:
            arduino_name = str(re.sub(r"['\[\]]", "", str(arduinos[0][0])))
            arduino_port = str(arduinos[0][1].name)
            break

        except IndexError:
            print("index out of range")

    print('name: ',arduino_name,'COM: ', arduino_port)

    compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
                        sketch_path='init_sketch',
                        board=arduino_name,
                        COM_PORT=arduino_port, )

    try:
        compiler.compile()

    except :
        pass

    os.remove(os.path.abspath('init_sketch/arduino_secrets.h'))


def run():
    SetupArduinos()


# Running the client
if __name__ == "__main__":
    run()
