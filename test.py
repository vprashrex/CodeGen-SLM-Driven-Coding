from pydantic import BaseModel
from langchain.schema import SystemMessage

'''
making schema

1.timestamp
2.username
3.password
4.message 
'''
import redis
import json
import uuid


redis_client = redis.Redis.from_url(url= "redis://localhost:6379/0")

name = "prash"
password = "prash"
time_stamp = "1234"

l = [1,2,4,5,5]

#s = redis_client.lpush("key", json.dumps({"list":l}))

redis_client.hset("12345",mapping={"name":name,"password":password,"time_stamp":time_stamp,"list":json.dumps(l)})
out = redis_client.hgetall("12345")
out = {k.decode("utf-8"):v.decode("utf-8") for (k,v) in out.items()}
print(out)


#out = redis_client.lrange("12345",0,0)[0]
#out = json.loads(out)
#print(out)

''' _items = redis_client.lrange("key", 0, -1)
items = [json.loads(m.decode("utf-8")) for m in _items[::-1]]
messages = messages_from_dict(items)
print(messages) '''



''' class Usermsg:
    def __init__(self,password, timestamp):
        self.password = password
        self.timestamp = timestamp


new_message_password = password
new_message_timestamp = timestamp

new_message = Usermsg(
    password=new_message_password,
    timestamp=new_message_timestamp
)

client = RedisChatMessageHistory(username)
client.append(new_message) '''




''' from api.pipeline import model_api
import asyncio

model = model_api.CodeGen()

async def generate_word(prompt: str):
    
    try:

        loop = asyncio.get_event_loop()
        future = loop.run_in_executor(None,model.infer,prompt)
        gen_word = await asyncio.wait_for(future,1)
        print(gen_word)
        for word in gen_word:
            print(word,end="",flush=True)
        print("")

    except asyncio.TimeoutError:
        print("Timeout Error")


asyncio.run(generate_word("print hello world"))

 '''