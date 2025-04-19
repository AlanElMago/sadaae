import asyncio
import concurrent.futures
import socketio

from typing import Final

NOTIFICATIONS_URL: Final = "http://localhost:3001"

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print("Conectado al servidor de notificaciones")

@sio.event
async def disconnect():
    print("Desconnectado del servidor de notificaciones")

async def main():
    await sio.connect(NOTIFICATIONS_URL)

    prompt = "Enviar mensaje ('salir' para salir): "
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    while True:
        user_input = await asyncio \
            .get_event_loop() \
            .run_in_executor(executor, input, prompt)

        if user_input == "salir":
            break

        await sio.emit("test-send-message", { "message": user_input })

    await sio.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
