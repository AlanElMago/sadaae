import requests
from typing import Final

from utils import print_json_data, validate_response

API_BASE_URL: Final = "http://localhost:3000/api"
REPORT_EXAMPLE_INDEX: Final = 1

report_examples = (
    {
        "latitude" :   "37.41010192204317",
        "longitude": "-102.61618884920453",
        "img_dir"  : "images/photo_burst_example_1",
        "img_count": 3,
        "img_name" : "robbery-example_1"
    },
    {
        "latitude" :   "37.40489664816609", 
        "longitude": "-102.61675708642171",
        "img_dir"  : "images/photo_burst_example_2",
        "img_count": 15,
        "img_name" : "robbery-example_2"
    }
)

def append_photos(camera_id: str, api_key: str, report_id: str) -> None:
    report_example = report_examples[REPORT_EXAMPLE_INDEX]

    img_dir   = report_example["img_dir"]
    img_name  = report_example["img_name"]
    img_count = report_example["img_count"]

    uri     = f"{API_BASE_URL}/v1/reports/append-photo/{report_id}"    
    headers = { "camera-id": camera_id, "x-api-key": api_key }

    print("\nAnexando fotografías...\n")

    for i in range(2, img_count + 1):
        photo_path = f"{img_dir}/{img_name}-{i:02}.jpg"
        files = {
            "photo": (
                f"{img_name}-{i:02}.jpg",
                open(photo_path, "rb"),
                "image/jpeg"
            ),
        }

        response = requests.post(uri, headers=headers, files=files)
        validate_response(response, requests.codes.created)

        print(f"Foto {i:02}/{img_count:02} subida correctamente")

def submit_report(camera_id: str, api_key: str) -> requests.Response:
    report_example = report_examples[REPORT_EXAMPLE_INDEX]

    latitude  = report_example["latitude"]
    longitude = report_example["longitude"]
    img_dir   = report_example["img_dir"]
    img_name  = report_example["img_name"]

    photo_path = f"{img_dir}/{img_name}-01.jpg"

    uri     = f"{API_BASE_URL}/v1/reports"
    headers = { "camera-id": camera_id, "x-api-key": api_key }
    data    = { "latitude" : latitude, "longitude": longitude }
    files   = {
        "photo": (
            f"{img_name}-01.jpg",
            open(photo_path, "rb"),
            "image/jpeg"
        ),
    }

    return requests.post(uri, headers=headers, data=data, files=files)

def main() -> None:
    camera_id = input("Ingresar ID de la Cámara: ")
    api_key = input("Ingresar Llave API: ")

    response = submit_report(camera_id, api_key)
    json = validate_response(response, requests.codes.created)

    print("\n201 Created\n")
    print_json_data(json)

    report_id = json["data"]["_id"]
    append_photos(camera_id, api_key, report_id)

if __name__ == "__main__":
    main()
