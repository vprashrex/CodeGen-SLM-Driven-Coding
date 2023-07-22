from pydantic import BaseModel
from strenum import StrEnum
from enum import auto
import uuid
from typing import Optional,Annotated,Union


class AskResponseType(StrEnum):
    waiting = auto()
    queueing = auto()
    message = auto()
    error = auto()

class AskResponse(BaseModel):
    type: AskResponseType
    conversation_id: uuid.UUID 
    message: str

class ChatRequest(BaseModel):
    prompt:str