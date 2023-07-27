'''

jwt :

conv_id
time_stamp: for each conversation

user_id
last_session: timestamp


get database handling here

MESSAGE HANDLER

TO DO THE FOLLOWING APPROACH CREATE

async def get_conv_id()


TO DO:
1. GET MY CONVERSATION ---> USE CONVERSATION ID TO FETCH THE ONE PARTICULAR CONVERSATION

# jwt ---> [user_id,conv_id -- current_conv] --> store cookie
2. GET CONVERSATION HISTORY ---> USE JWT TO GET ALL THE CONVERSATION OF THE PARTICULAR USER : IF USER LOGGED IN


3. GET CONVERSATION FROM COOKIES ---> IF USER IS NOT LOGGED IN
    STORING ALL THE CONVERSATION OF THE USERS IN COOKIES SO THAT
    ONCE HE CLOSED THE BROWSER COOKIES WILL BE DESTROYED

4. DELETE CONVERSATION ---> USE CONVERSATION ID TO DELETE THE PARTIUCLAR CONVERSATION

5. DELETE ALL CONVERSATION ---> USE EMAIL_ID/USER_ID TO DELETE ALL CONVERSATION
    #guest-mode ---> cookie(user_id --> random user_id genearate for every session)
    userid --> random uuid --> python --> cookie_store --> get id using cookie ---> timeout [1hr] ---> delete chats

    store 
    user_id  ----> global variables ---> easily we can fetch this in js and send id ---> python routes ke undar
    conv_id 

6. UPDATE CONVERSATION_TITLE --> GET CONV_ID ---> AND UPDATE THE TITLE OF CONV IN DB

7. GENERATE_CONV_TITLE ---> USE CONV_ID --> TO GENERATE_THE TITLE 
    CONV_TITLE --> WILL BE BASED ON THE FIRST QUESTION

'''

'''

schema 

class Conversation:
    conv_id: str(uuid.uuid4())
    conv_title: first_question
    q/a: [{q:a},{q:a},{q:a}] 
    datetime: timestamp
'''

'''
const conv_id = cookie.get(conv_id)

post("/conv/conv_id")

@route.get("/conv/{conv_id}")
async def get_conv_id(conv_id: str):
    print(conv_id)
'''


import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uuid
import datetime
import json
import redis

r = redis.StrictRedis(host='localhost', port=6379, db=0)

router = APIRouter()

class Conv(BaseModel):
    question: str
    answer: str

async def gen_id():
    return uuid.uuid4()

# redis hset
qaList = []
@router.post("/conv")
async def get_conv(conv: Conv):
    try:
        conv_id = await gen_id()
        str_conv_id = str(conv_id)
        question = conv.question
        ans = conv.answer
        qa = {question:ans}
        qaList.append(qa)
        dtime = datetime.datetime.now()
        dtime = dtime.strftime("%d/%m/%Y, %H:%M:%S")
        print(qaList)
        print(str_conv_id)

        qaList_json = json.dumps(qaList)
        
        session_key = f"session:{str_conv_id}"

        r.hset(session_key, mapping={
            'conv_id':str_conv_id,
            'qa':qaList_json,
            'time':dtime
        })

    except Exception as e:
        return JSONResponse(
            content={"error":"error occured!"},
            status_code=400
        )

@router.get("/conv/conv-title/{str_conv_id}")
async def gen_convtilte(str_conv_id:str):
    try:
        session_key = f"session:{str_conv_id}"
        session_data = r.hget(session_key, 'qa')
        session_data = json.loads(session_data.decode('utf-8'))[0]
        session_data = dict(session_data)
        conv_title = [k for (k,v) in session_data.items()][0]

        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
    
        return JSONResponse(
            content = {"conv_title":conv_title},
            status_code = 200
        )


    except Exception as e:
        print(e)
        return JSONResponse(
            content={"error":str(e)},
            status_code=400
        )
    
@router.get("/con/{str_conv_id}")
async def get_data(str_conv_id: str):
    session_key = f"session:{str_conv_id}"
    session_data = r.hgetall(session_key)
    session_data_str = dict(session_data)
    #session_data_str = {k.decode():json.loads(v.decode()) for (k,v) in session_data.items()}
    session_data_str = {k.decode('utf-8'):v.decode('utf-8') for (k,v) in session_data.items()}
    print(session_data_str)

    if not session_data_str:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return JSONResponse(
        content = {"message":session_data_str},
        status_code = 200
    )