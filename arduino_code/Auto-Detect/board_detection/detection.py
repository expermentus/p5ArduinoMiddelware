import re
from serial.tools import list_ports
from dicts.boards import boards_dict


def check_ports():
    # Lists to store Arduino connections and non-Arduino connections
    not_arduinos = []
    arduinos = []

    # Iterate through available serial ports
    for connection in list_ports.comports():
        port, hwid, desc = connection

        # Extract VID:PID information using regular expressions
        vid_pid = re.search(r"(?<=VID\:PID\=)[0-9|A-Z|a-z]{4}\:[0-9|A-Z|a-z]{4}", desc)
        vid_pid = None if vid_pid is None else vid_pid.group()

        # Check if VID:PID is found in boards_dict
        if vid_pid is None:
            not_arduinos.append(connection)  # No match found, add to non-Arduinos list
        else:
            try:
                board = boards_dict[vid_pid]
                arduinos.append((board, connection))  # Match found, add to Arduinos list
            except KeyError:
                not_arduinos.append(connection)  # VID:PID found, but not in boards_dict

    return arduinos, not_arduinos


if __name__ == "__main__":
    # Call the check_ports function
    arduinos, not_arduinos = check_ports()

    # Print Arduino connections
    for ard in arduinos:
        print("Arduino Board:", ard[0], type(ard[0]))  # Print the Arduino board name
        print("Connection Info:", ard[1])  # Print connection information
        print("name: ", ard[1].name)
        print("device: ", ard[1].device)
        print("hwid: ", ard[1].hwid)
        print("pid: ", ard[1].pid)
        print("vid: ", ard[1].vid)
        print("description: ", ard[1].description)
        print("COM: ", re.sub(r'COM', '', ard[1].name))
    # Print non-Arduino connections
    for nard in not_arduinos:
        print("Non-Arduino Connection:", nard)

