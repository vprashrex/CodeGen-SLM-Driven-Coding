from fastapi import APIRouter,Depends
from api.pipeline import model_api
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi.responses import StreamingResponse
from api.schemas.chat_schema import ChatRequest
from fastapi.responses import JSONResponse
import io
import sys

router = APIRouter()
model = model_api.CodeGen()

async def stram_buffer(word:str):
    buffer = io.StringIO()
    sys.stdout = buffer
    sys.stdout.write(word)
    out = buffer.getvalue()
    sys.stdout = sys.__stdout__
    return out

@asynccontextmanager
async def load_model() -> AsyncGenerator[model_api.CodeGen,None]:
    try:
        yield model
    
    finally:
        pass

async def generate_word(prompt: str):
    async with load_model() as model:
        gen_word = model.infer(prompt)
        for word in gen_word:
            yield word

@router.post("/api/instruct_resp",tags=["chat"])
async def generate(chat_request: ChatRequest):
    try:
        user_prompt = chat_request.prompt
        return StreamingResponse(
            generate_word(user_prompt),
            status_code=200,
            media_type="text/plain"
        )
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=200,
            content={"error":str(e)}
        )
        