import re, os, time
from detection import check_ports
from compiler import Compiler
from generate_init_header import generate_header_file
from send_recieve_json import send_json, receive_json


def SetupArduinos():
    arduinos, notarduinos = check_ports()

    if len(arduinos) == 0:
        print('No arduinos found')
        return False

    send_json(arduinos)

    while 1:
        data = receive_json()

        if data is False:
            print('No data')
            time.sleep(2)
            pass

        elif any(value is None for value in data.values()):
            print('Der står sgu at det er tomt')
            pass
            time.sleep(2)

        else:
            break

    generate_header_file('init_sketch/arduino_secrets.h',
                         data['ssid'],
                         data['password'],
                         data['stopic'])
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
            arduino_port = str(arduinos[0][1].name)  # .name or .device
            break

        except IndexError:
            print("index out of range")

    compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
                        sketch_path='init_sketch',
                        board=arduino_name,
                        COM_PORT=arduino_port, )

    if compiler.compile():
        # http response
        print('Successfully flashed arduino')
        os.remove(os.path.abspath('init_sketch/arduino_secrets.h'))
        return True

    else:
        # http response
        print('Øv bøv bussemand')
        os.remove(os.path.abspath('init_sketch/arduino_secrets.h'))
        return False


def run():
    SetupArduinos()


# Running the client
if __name__ == "__main__":
    run()
