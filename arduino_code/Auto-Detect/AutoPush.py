import serial
import serial.tools.list_ports

def detect_arduino_board():
    # List available COM ports
    com_ports = list(serial.tools.list_ports.comports())

    for com_port in com_ports:
        try:
            with serial.Serial(com_port.device, 9600, timeout=1) as ser:
                response = ser.read(200).decode('utf-8', 'ignore')

                if response:
                    return {"COM Port": com_port.device}

        except serial.SerialException:
            pass

    return None

if __name__ == "__main__":
    arduino_board = detect_arduino_board()

    if arduino_board:
        print(f"COM Port: {arduino_board['COM Port']}, Arduino Detected")
    else:
        print("No Arduino board detected on any COM port.")
