import re
from detection import check_ports
from compiler import Compiler
import os

arduinos, notarduinos = check_ports()

for i in range(len(arduinos)):
    print("Boards:")
    print(i + 1, ":", arduinos[i][0], arduinos[i][1])

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
