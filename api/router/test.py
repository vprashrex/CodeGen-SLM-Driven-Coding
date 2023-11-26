import json
import redis

# Establish a connection to Redis
r = redis.StrictRedis(host="localhost", port=6379, db=0)

#retrieved_data = r.lindex("sessions", 0)  # Assuming it's stored at index 0

print("current: ",r.lrange("sessions",0,-1))

#r.delete("sessions")
#refresh_session = json.loads(retrieved_data)
'''for sessions in refresh_session:
    for (key, value) in sessions.items():
        if key == session.session_id:
        print("updated: ",r.lrange("sessions",0,-1))'''