from fastapi import FastAPI,Request
from pydantic import BaseModel
from pipeline import model_api
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse,JSONResponse,StreamingResponse
import uvicorn
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import asyncio

origins = [
    "*"
]

app = FastAPI()

connected_clients = set()

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

class ChatRequest(BaseModel):
    prompt: str


@asynccontextmanager 
async def load_model() -> AsyncGenerator[model_api.CodeGen,None]:
    try:
        yield model
    finally:
        pass

async def generate_words(model,user_prompt:str):
    async with load_model() as model:
        gen_words = model.infer(user_prompt)
        for word in gen_words:
            yield word
            await asyncio.sleep(1)


@app.post("/instruct_resp")
async def generate(chat_request: ChatRequest):
    try:
        user_prompt = chat_request.prompt
        return StreamingResponse(generate_words(model,user_prompt),media_type="text/event-stream")

    except Exception as e:
        print(e)
        return JSONResponse(status_code=400,content={"error":str(e)})



if __name__ == '__main__':
    uvicorn.run("main:app",port="5000",reload=True)