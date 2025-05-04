from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

class FileResponse(BaseModel):
    filename: str
    filepath: str
    uploaded_at: datetime
    user_email: str
    filetype: str
    file_uuid: str


class ResultResponse(BaseModel):
    filename: str
    result: str
    user_email: str
    filetype: str
    file_uuid: str

    class Config:
        orm_mode = True