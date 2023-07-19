from fastapi import FastAPI,Request
from fastapi.responses import HTMLResponse,JSONResponse,Response
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="./templates/")

@app.get("/",response_class=HTMLResponse)
async def index(request:Request):
    return templates.TemplateResponse("index.html",context={"request":request})


async def fake_stream_data():
    for i in range(10):
        yield b'some fake data\n\n'

import asyncio

@app.post("/message",response_class=HTMLResponse)
async def message():
    try:
        async def fake_stream_data():
            for i in range(10):
                yield f'This is chunk {i}\n'
                await asyncio.sleep(1)
        return Response(content=fake_stream_data(),media_type="text/plain")
    except Exception as e:
        print(e)
        return JSONResponse(
            content={"message":str(e)},
            status_code=400
        )