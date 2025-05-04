from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base
import datetime
import uuid
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    result = Column(String)
    user_email = Column(String)
    filetype = Column(String)
    file_uuid = Column(String, ForeignKey("uploaded_files.file_uuid")) 
    uploaded_file = relationship("UploadedFile")  
    
class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    filepath = Column(String)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_email = Column(String)
    filetype = Column(String)
    file_uuid = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))

class TrainingData(Base):
    __tablename__ = "training_data"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String)
    uploaded_at = Column(DateTime, default=func.now())
    user_email = Column(String, nullable=True)
    filetype = Column(String, nullable=False)  # ai / human

