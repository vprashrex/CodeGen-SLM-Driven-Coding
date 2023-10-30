from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

origins = [
    "*"
]

def init_app():
    '''
    initliaze db here
    '''


    VERSION = "0.1"
    
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    # mounting the static files
    app.mount("/static",StaticFiles(directory="./static"),name="static")
    templates = Jinja2Templates(directory="./templates/")

    # render index.html
    @app.get("/",response_class=HTMLResponse)
    async def index(request:Request):
        return templates.TemplateResponse("index.html",context={"request":request})

    from api.router import chat,conv

    app.include_router(chat.router)
    app.include_router(conv.router)

    return app

app = init_app()