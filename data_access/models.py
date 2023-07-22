from sqlalchemy import Column,String,TIMESTAMP,DateTime
from sqlalchemy.orm import declarative_base
import uuid


Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "messages"

    msg_id = Column(String,primary_key=True,default=generate_uuid)
    ques = Column(String,nullable=False)
    ans = Column(String,nullable=False)
    timestamp = Column(DateTime,nullable=False)

    def dict(self):
        return {
            "msg_id":self.id,
            "ques":self.username,
            "ans":self.password,
            "timestamp":self.message
        }