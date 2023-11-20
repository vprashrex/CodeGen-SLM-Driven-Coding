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

############## CODE START ########################

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uuid
import datetime
import json
import redis
import jwt
from fastapi.responses import JSONResponse


router = APIRouter()
r = redis.StrictRedis(host="localhost",port=6379,db=0)

'''
NOTE THIS IS FOR EXPERIMENTAL PURPOSE 
you can remove the dict = {}
'''
dicts = {} 


class ChatHtml(BaseModel):
    session_id: str

############# DELETE SESSION_ID ##############

'''
THIS WILL REMOVE THE SESSION_ID FROM THE REDIS

JS CODE LINE NO 500 TO 514 (main.js)
'''

@router.post("/remove_session")
async def remove_session(session:ChatHtml):
    try:
        dicts.pop(session.session_id)
    except Exception as e:
        print(e)



############### FETCH PRESENT SESSION ##############
'''
THIS FUNCTION WILL FETCH THE PRESENT SESSION
AND PROVIDE HTML CODE TO THE FRONT-END
AND FORNT-END WILL RENDER THIS HTML CODE

frontend ---> present_session ---> backend ---> fetch html_code 
---> frontend ---> render

JS CODE LINE 532 - 553
'''


@router.post("/session")
async def session(chat_request:ChatHtml):
    try:
        print("current session : {}".format(chat_request.session_id))

        # EXTRACT THE HTML FROM THE PRESENT SESSION
        # SEND IT TO THE FRONTEND 
        htmlcode = r.hget(chat_request.session_id, "html")
        if htmlcode is not None:
            html = htmlcode.decode('utf-8')
        else:
            html = None
        #print("code: ", html)

        return JSONResponse(
            content={"content":html},
            status_code=200
        )
    except Exception as e:
        print(e)
        return JSONResponse(content={"error":str(e)})



################# FETCH ALL SESSION_IDS ON RESTART #############


'''
THIS FUNCTION WILL FETCH ALL THE SESSION ID PRESENT IN THE 
REDIS DATABASE ALONG WITH TITLE

main.js --> localrefresh()
code line 421 - 459
main : 437 - 455

'''

@router.post("/fetch_session")
async def fetch_session(session_id:ChatHtml):
    try:

        '''
        REDIS CODE TO FETCH ALL THE SESSION ID 
        ALONG WITH TITLE

        IMP DATA NEEDED : SESSION_ID AND TITLE

        CLEAR THIS CODE AND WRITE YOUR OWN LOGIC

        PRESENT_SESSION --> HTML_CODE

        '''


        global dicts

        # redis ke undar data store
        # fetch ---> [session_id,title] --> dicts {session_id:title}

        '''
        html = None
        if present_session is not None:

            html = r.hget(session_id,"html")
  
        data = r.hgetall()
        list_of_values = []
        dict_to_front = {}

        for (k,v) in data.items():
            session_id = k
            title = v[0]
            
            if k == present_session:
                html = v[1]
                dict_to_front[k] = [title,html]

            dict_to_front[session_id] = [title]

        print(dict_to_front)
            
        '''

        return JSONResponse(
            content={"content":dicts}
        )
    except Exception as e:
        print(e)


################ STORE ALL CONVERSATION #######################

'''
THIS FUNCTION WILL STORE ALL THE CHAT HISTORY
IN THE REDIS DATABASE

DATA STORED

PRESENT_SESSION
TITLE
userText --> question
HTML --> UPDATABLE HTML [IMP DON'T APPEND IT INSTEAD UPDATE THE HTML COLUMN]
TIMESTAMP

MAIN.JS CODE LINE 152 - 167
'''


class Conv(BaseModel):
    session_id: str
    title:str
    userText: str
    html: str
    timestamp: str


@router.post("/conv")
async def store_conv(conv: Conv):
    try:
        session_id = conv.session_id
        userText = conv.userText
        html = conv.html
        title = conv.title
        timestamp = conv.timestamp

        r.hmset(session_id, {"title": title, "html": html, "time": timestamp, "userText": userText, })
        print("Current session_id is: ",session_id)
        #print("html", html)

        # [TITLE -> 0, HTML -> 1]
        
        #dicts[conv.session_id] = [conv.title,conv.html]
        # [title,html,timestamp,usertext]

    except Exception as e:
        print(e)