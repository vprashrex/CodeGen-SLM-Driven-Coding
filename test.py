from api.pipeline import model_api
import asyncio

model = model_api.CodeGen()

async def generate_word(prompt: str):
    
    try:

        loop = asyncio.get_event_loop()
        future = loop.run_in_executor(None,model.infer,prompt)
        gen_word = await asyncio.wait_for(future,1)
        print(gen_word)
        for word in gen_word:
            print(word,end="",flush=True)
        print("")

    except asyncio.TimeoutError:
        print("Timeout Error")


asyncio.run(generate_word("print hello world"))

