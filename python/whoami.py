import requests
from typing import Final

from utils import print_json_data, validate_response

API_BASE_URL: Final = "http://localhost:3000/api"

def whoami(camera_id: str, api_key: str) -> None:
    uri = f"{API_BASE_URL}/v1/cameras/whoami"    
    headers = { "camera-id": camera_id, "x-api-key": api_key }

    return requests.get(uri, headers=headers)

def main() -> None:
    camera_id = input("Ingresar ID de la Cámara: ")
    api_key = input("Ingresar Llave API: ")

    response = whoami(camera_id, api_key)
    json = validate_response(response, requests.codes.ok)

    print("\n200 OK\n")
    print_json_data(json)

if __name__ == "__main__":
    main()
