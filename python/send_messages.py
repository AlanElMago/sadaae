import asyncio
import concurrent.futures
import nats

from typing import Final

NATS_URI: Final = "nats://localhost:4222"

async def main() -> None:
    nats_conn = await nats.connect(NATS_URI)

    input_message = "Enviar mensaje ('salir' para salir): "
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    while True:
        user_input = await asyncio \
            .get_event_loop() \
            .run_in_executor(executor, input, input_message)

        if user_input == "salir":
            break

        await nats_conn.publish("prueba", user_input.encode())

    await nats_conn.drain()

if __name__ == "__main__":
    asyncio.run(main())
