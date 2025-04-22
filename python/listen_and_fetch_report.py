import asyncio
import concurrent.futures
import requests
import socketio
import socketio.exceptions

from typing import Final
from oauthlib.oauth2.rfc6749.errors import InvalidGrantError
from requests_oauthlib import OAuth2Session

import sadaae

from utils import print_json_data, validate_response

API_REPORTS_ENDPOINT: Final = "http://localhost:3000/api/v1/reports"
NOTIFICATIONS_URL: Final = "http://localhost:3001"
OPERATOR_USER_EMAIL: Final = "operator@example.com"
OPERATOR_USER_PASSWORD: Final = "operator1234%"
REPORT_REFRESH_TIME: Final = 60 # segundos

oauth: OAuth2Session = None
sio = socketio.AsyncClient()

@sio.event
async def connect() -> None:
    print("Conectado al servidor de notificaciones. Teclee 'salir' para salir")

@sio.event
async def disconnect() -> None:
    print("Desconnectado del servidor de notificaciones")

@sio.event
async def error(error_message) -> None:
    print(f"Error: {error_message}")

@sio.event
async def alert(data: dict) -> None:
    print("\n¡Alerta de Asalto/Extorsión!\n")

    report = fetch_report(data["report_id"]);
    print_json_data(report)

    print(f"\nRefrescando reporte en {REPORT_REFRESH_TIME} segundos...\n")
    await asyncio.sleep(REPORT_REFRESH_TIME)

    report = fetch_report(data["report_id"]);
    print_json_data(report)

def fetch_report(report_id: str) -> dict:
    global oauth

    response = oauth.get(f"{API_REPORTS_ENDPOINT}/{report_id}")

    return validate_response(response, requests.codes.ok)

async def main() -> None:
    global oauth

    user_email = input("Email (operator@example.com): ")
    user_password = input("Password (operator1234%): ")

    user_email = user_email if user_email else OPERATOR_USER_EMAIL
    user_password = user_password if user_password else OPERATOR_USER_PASSWORD

    try:
        oauth = sadaae.login(user_email, user_password)
    except InvalidGrantError:
        print("Credenciales inválidas. Verifica su correo y contraseña.")
        return

    sio_auth = { "token": oauth.token['access_token'] }

    try:
        await sio.connect(NOTIFICATIONS_URL, auth=sio_auth)
    except socketio.exceptions.ConnectionError:
        return

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    while sio.connected:
        user_input = await asyncio \
            .get_event_loop() \
            .run_in_executor(executor, input)
        
        if user_input == "salir":
            break

    await sio.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
