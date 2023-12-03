import redis
import json

# Connect to Redis
r = redis.StrictRedis(host="localhost", port=6379, db=0)

mylist = {"key3":"value3"}
s = json.dumps(mylist)
r.lpush("rml5",s)
list = r.lrange("rml5", 0, -1)

for l in list:
    for (k,v) in json.loads(l).items():
        print(k,v)

#print("current list elements:", r.lrange("rml5", 0, -1))
''' 

r.lrem("rml4", 0,json.dumps({"key2": "value2"}))

print("Updated list elements:", r.lrange("rml4", 0, -1))
 '''
