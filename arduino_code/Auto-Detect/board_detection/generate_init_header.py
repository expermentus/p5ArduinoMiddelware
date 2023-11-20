import os


def generate_header_file(path, SSID, Password, stopic, mqttun, mqttpw):
    # Define the content of the header file
    header_content = f"""
    #define SECRET_SSID "{SSID}"
    #define SECRET_PASS "{Password}"
    #define SECRET_STOPIC "{stopic}"
    #define SECRET_BROKER "130.225.37.228"
    #define SECRET_PORT 1883
    """

    file_path = os.path.abspath(path)

    try:
        # Create or replace the file
        with open(file_path, "w") as header_file:
            # Write the content to the file
            header_file.write(header_content)

    except Exception as e:
        print(f"Error: {e}")


if __name__ == '__main__':
    # Call the function to generate or replace the header file
    generate_header_file('init_sketch',
                         'network',
                         'secret_code',
                         'interesting_topic',
                         'mqttUserName',
                         'mqttPassWord')
