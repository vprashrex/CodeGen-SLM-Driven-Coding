from fastapi import FastAPI,Request
from pydantic import BaseModel
from pipeline import model_api
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse,JSONResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import AsyncGenerator

origins = [
    "*"
]

app = FastAPI()
app.add_middleware(

    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

VERSION = "0.1"


class PromptRequest(BaseModel):
    
    prompt_text: str
    max_response_length: int = 128



# mounting the static files
app.mount("/static",StaticFiles(directory="./static"),name="static")
templates = Jinja2Templates(directory="./templates/")

model = model_api.CodeGen()

# render index.html
@app.get("/",response_class=HTMLResponse)
async def index(request:Request):
    return templates.TemplateResponse("index.html",context={"request":request})

from fastapi.responses import StreamingResponse
import asyncio


class ChatRequest(BaseModel):
    prompt: str


@asynccontextmanager 
async def load_model() -> AsyncGenerator[model_api.CodeGen,None]:
    try:
        yield model
    finally:
        pass


import io
import sys

async def steam_buffer(word:str):
    buffer = io.StringIO()
    sys.stdout = buffer
    sys.stdout.write(word)
    out = buffer.getvalue()
    sys.stdout = sys.__stdout__
    return out

async def generate_word(prompt: str):
    async with load_model() as model:
        gen_word = model.infer(prompt)
        for word in gen_word:
            yield f"{word}\n"

@app.post("/instruct_resp")
async def generate(chat_request: ChatRequest):
    try:
        user_prompt = chat_request.prompt    
        return StreamingResponse(
            generate_word(user_prompt),
            media_type="text/plain"
        )
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400,content={"error":str(e)})