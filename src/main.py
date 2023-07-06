from fastapi import FastAPI,Request
from pydantic import BaseModel
from src.code_gen_api import model_api
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

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

ModelClass = model_api.CodeGen
model = ModelClass()

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




if __name__ == '__main__':
    uvicorn.run("main:app",port="5000",reload=True)