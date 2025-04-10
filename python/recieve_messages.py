import asyncio
import concurrent.futures
import nats

from nats.aio.msg import Msg
from typing import Final

NATS_URI: Final = "nats://localhost:4222"

async def main() -> None:
    nats_conn = await nats.connect(NATS_URI)

    async def message_handler(msg: Msg) -> None:
        subject = msg.subject
        data = msg.data.decode()

        print(f"Mensaje recibido en '{subject}': {data}")

    nats_sub = await nats_conn.subscribe("prueba", cb=message_handler)

    user_input = ""
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    print("Conectado al servidor NATS. Teclee 'salir' para salir.")

    while True:
        user_input = await asyncio \
            .get_event_loop() \
            .run_in_executor(executor, input)

        if user_input == "salir":
            break

    await nats_sub.unsubscribe()
    await nats_conn.drain()

if __name__ == "__main__":
    asyncio.run(main())
