from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import passlib.hash as _hash
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm
from fastapi import APIRouter,Request,Depends
from datetime import datetime
from pydantic import BaseModel
from datetime import timedelta,datetime
from jose import jwt
from typing import Optional


SECRET_KEY = "bb7fe48736386c366df3f30cc739edf1b13cbf740633298219cc451f81ace0bf"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class JWTRepo:
    def __init__(self,data: dict = {},token: str = None):
        self.data = data
        self.token = token

    def generate_token(self,expires_delta: Optional[timedelta] = None):
        to_encode = self.data.copy()

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(seconds=120)

        to_encode.update({"exp":expire})

        encode_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
        return encode_jwt

    def decode_token(self):
        import datetime
        try:
            decode_token = jwt.decode(
                self.token,SECRET_KEY,algorithms=[ALGORITHM]
            )
            return decode_token if decode_token["expires"] >= datetime.time() else None

        except Exception as e:
            return {}
        
    @staticmethod
    def extract_token(token:str):
        return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

if __name__ == '__main__':
    import uuid
    data = {"conv_id":str(uuid.uuid4())}
    r = JWTRepo(data)
    print(r.generate_token())
    encode_token = r.generate_token()
    print(r.extract_token(encode_token))