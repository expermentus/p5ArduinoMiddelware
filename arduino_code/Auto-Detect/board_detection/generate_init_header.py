import os


def generate_header_file(SSID, Password, stopic, mqttun, mqttpw):
    # Define the content of the header file
    header_content = f"""
    #define SECRET_SSID "{SSID}"
    #define SECRET_PASS "{Password}"
    #define SECRET_STOPIC "{stopic}"
    #define SECRET_MQTTUN "{mqttun}"
    #define SECRET_MQTTPW "{mqttpw}"
    """

    file_path = os.path.abspath('arduino-cli_0.34.2_Windows_64bit/libraries/arduino_secrets.h')

    try:
        # Check if the file already exists
        if not os.path.exists(file_path):
            # If it doesn't exist, create the file
            with open(file_path, "w") as header_file:
                # Write the content to the file
                header_file.write(header_content)
                print(f"Header file '{file_path}' created successfully.")
        else:
            print(f"Header file '{file_path}' already exists. Skipping creation.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    # Call the function to generate the header file
    generate_header_file('network',
                         'secret_code',
                         'interesting_topic',
                         'mqttUserName',
                         'mqttPassWord')
