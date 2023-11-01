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


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uuid
import datetime
import json
import redis
import jwt

r = redis.StrictRedis(host='localhost', port=6379, db=0)

router = APIRouter()

class Conv(BaseModel):
    question: str
    answer: str
    html: str
    session: str

async def gen_id():
    return uuid.uuid4()

# redis hset
qaList = []
@router.post("/conv")
async def get_conv(conv: Conv):
    try:
        conv_id = await gen_id()
        session_key = conv.session
        print(session_key)
        question = conv.question
        ans = conv.answer
        html = conv.html
        qa = {question:ans}
        qaList.append(qa)#[{"question1":"ans1"},{"question2":"ans2"}]
        dtime = datetime.datetime.now()
        dtime = dtime.strftime("%d/%m/%Y, %H:%M:%S")

        first_qa = qaList[0]
        conv_title = next(iter(first_qa))

        #print(conv_title)
        print(qaList)
        #print(str_conv_id)

        Conv_json = json.dumps({"qalist":qaList,"conv_id":session_key,"conv_title":conv_title,"time":dtime})

        #r.lpush(session_key,r.lpush(question,ans))
        r.set(session_key,html)#update with this key(2003)
        '''for i in r.lrange(session_key, 0,- 1):
            print(i)'''
        
        data = {"conv_id":session_key, "conv_title":conv_title, "time":dtime, "exp":datetime.datetime.utcnow()+ datetime.timedelta(hours=1)}
        secret_key = "9d38ddb8d95d5e3b6efc132b8da4a30281024696a74e385806b168c9195b26de"
        token = jwt.encode(data, secret_key, algorithm="HS256")
        print("JWT Token is: ",token)
        #print("Session_id: ",session_key)
        htmlcode = r.get(session_key)
        #print("-------------HTML CODE BELOW-------------------------")
        #print(htmlcode.decode('utf-8'))

    except Exception as e:
        print(e)