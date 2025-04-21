import asyncio
import concurrent.futures
import socketio

from typing import Final
from oauthlib.oauth2.rfc6749.errors import InvalidGrantError
import socketio.exceptions

from sadaae import login

NOTIFICATIONS_URL: Final = "http://localhost:3001"
OPERATOR_USER_EMAIL: Final = "operator@example.com"
OPERATOR_USER_PASSWORD: Final = "operator1234%"

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

@sio.on('test-response-message')
async def test_response_message(data: dict) -> None:
    print(f"Mensaje recibido: {data["message"]}")

async def main() -> None:
    user_email = input("Email (operator@example.com): ")
    user_password = input("Password (operator1234%): ")

    user_email = user_email if user_email else OPERATOR_USER_EMAIL
    user_password = user_password if user_password else OPERATOR_USER_PASSWORD

    try:
        oauth = login(user_email, user_password)
    except InvalidGrantError:
        print("Credenciales inválidas. Verifica su correo y contraseña.")
        return

    auth = {"token": oauth.token['access_token']}

    try:
        await sio.connect(NOTIFICATIONS_URL, auth=auth)
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
