from fastapi import FastAPI
from fastapi.responses import Response,JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import redis


templates = Jinja2Templates(directory='templates')

app = FastAPI()

app.mount("/static",StaticFiles(directory="static"))

#r = redis.StrictRedis(host="localhost",port=6379,db=0)

@app.get("/")
async def get(request:Request):
    return templates.TemplateResponse("4.html",context={"request":request})


class ChatHtml(BaseModel):
    session_id: str

@app.post("/session")
async def session(chat_request:ChatHtml):
    try:
        print("current session : {}".format(chat_request.session_id))
    except Exception as e:
        print(e)
        return JSONResponse(content={"error":str(e)})


class ChatRequest(BaseModel):
    session_id: str
    userText: str
    html: str
    title:str
    timestamp: str

@app.post("/chat")
async def chat(chat_request:ChatRequest):
    try:
        print("session_id : {}".format(chat_request.session_id))
        print("user Input : {}".format(chat_request.userText))
        print("title: {}".format(chat_request.title))
        print("\n")
        print("html : \n{}".format(chat_request.html))
        print("\n")
        print("DateTime : {}".format(chat_request.timestamp))

    except Exception as e:
        print(e)
        return JSONResponse(content={"error":str(e)})