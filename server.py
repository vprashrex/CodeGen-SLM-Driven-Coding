from fastapi import FastAPI,Request
from pydantic import BaseModel
from pipeline import model_api
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse,JSONResponse
import uvicorn
from pydantic import BaseModel
import asyncio
from cachetools import cached,TTLCache

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


# render index.html
@app.get("/",response_class=HTMLResponse)
async def index(request:Request):
    return templates.TemplateResponse("index.html",context={"request":request})

class ChatRequest(BaseModel):
    prompt: str


model = None
model_initialized = False
#model_task = None

''' @app.on_event("startup")
async def startup_event():
    global model,model_initiliazed,model_task
    model_task = asyncio.create_task(initiliaze_model()) '''


# MODEL INITILIZATION
async def initiliaze_model():
    model = model_api.CodeGen()
    return model


async def get_or_initialize_model():
    global model, model_initialized
    if not model_initialized:
        model = await initiliaze_model()
        model_initialized = True
    return model

get_or_initialize_model_task = asyncio.create_task(get_or_initialize_model())

@app.post("/instruct_resp")
async def generate(chat_request: ChatRequest):
    #global model,model_initiliazed,model_task
    try:
        model = await get_or_initialize_model_task
        user_prompt = chat_request.prompt
        gen_word = model.infer(user_prompt)
        for word in gen_word:
            print(word,end="",flush=True)
        print("")
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400,content={"error":str(e)})



if __name__ == '__main__':
    uvicorn.run("main:app",port="5000",reload=True)