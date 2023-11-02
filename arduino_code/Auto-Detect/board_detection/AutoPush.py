import re
from serial.tools import list_ports
from boards import boards_dict
from detection import check_ports
from everywhereml.arduino import Sketch, Ino, H
from everywhereml.arduino.Cli import Cli

arduinos, notarduinos = check_ports()

sketch = Sketch(name="green", folder="tests")

cli = Cli
cli.configure_exe(cli, 'arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe')

for i in range(len(arduinos)):
    print("Boards:")
    print(i + 1, ":", arduinos[i][0], arduinos[i][1])

# Code to add to the sketch:

sketch += Ino("""
#include <WiFiNINA.h>
#include <Arduino_MKRIoTCarrier.h>
MKRIoTCarrier carrier;

void setup() {
  carrier.begin();
  carrier.display.fillScreen(0x07E0); // green
  }

void loop() {

}
""")

while 1:

    selected = int(input("Select board: "))

    try:
        arduino = arduinos[selected - 1]
        break

    except IndexError:
        print("index out of range")

arduino_name = str(re.sub(r"['\[\]]", "", arduino[0][0]))

print(arduino_name)

if sketch.compile(cli=cli, board=arduino_name).is_successful:
    print('Log', sketch.output)
    print('Sketch stats', sketch.stats)
else:
    print('ERROR', sketch.output)
