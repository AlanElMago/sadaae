import asyncio
import concurrent.futures
import socketio

from typing import Final

NOTIFICATIONS_URL: Final = "http://localhost:3001"

sio = socketio.AsyncClient()

@sio.event
async def connect() -> None:
    print("Conectado al servidor de notificaciones. Teclee 'salir' para salir")

@sio.on('test-response-message')
async def test_response_message(data: dict) -> None:
    print(f"Mensaje recibido: {data["message"]}")

@sio.event
async def disconnect() -> None:
    print("Desconnectado del servidor de notificaciones")

async def main():
    await sio.connect(NOTIFICATIONS_URL)

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    while True:
        user_input = await asyncio \
            .get_event_loop() \
            .run_in_executor(executor, input)
        
        if user_input == "salir":
            break

    await sio.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
