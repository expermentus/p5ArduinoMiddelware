import requests
import json


def send_json(arduinos):
    url = 'http://130.225.39.149/api/test'

    # Create a sample JSON payload (replace this with your actual data)
    json_data_to_send = {
        "arduino1": [arduino[0] for arduino in arduinos],
    }

    try:
        # Convert the dictionary to JSON
        json_payload = json.dumps(json_data_to_send)

        # Send a POST request with the JSON payload
        response = requests.post(url, data=json_payload, headers={'Content-Type': 'application/json'})
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)

        # Assuming the API response contains JSON data
        api_response = response.json()

        # Print the API response
        print('API Response:', api_response)

    except requests.exceptions.RequestException as err:
        print(f'Error making the request: {err}')

    except json.JSONDecodeError as err:
        print(f'Error decoding JSON file: {err}')


def receive_json():
    # Make a GET request to the /api/testget endpoint
    url = 'http://130.225.39.149/api/testget'
    response_testget = requests.get(url)
    response_testget.raise_for_status()

    # Print the JSON response from /api/testget
    print('API Response from /api/testget:', response_testget.json())
    json = response_testget.json()
    data = {
        'choice': json.get('choice', None),
        'ssid': json.get('ssid', None),
        'password': json.get('password', None),
        'stopic': json.get('password', None),
        'mqttun': json.get('mqttun', None),
        'mqttpw': json.get('mqttpw', None)
    }

    return json
