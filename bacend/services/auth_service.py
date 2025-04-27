from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models import User
from core.config import settings
from utils.security import verify_password
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models import User
from core.config import settings
from utils.security import verify_password
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database import get_db
from schemas import Token, UserResponse
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Invalid or expired token")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: Optional[str] = payload.get("sub") #исправил username на email
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first() #исправил username на email
    if user is None:
        raise credentials_exception
    return user
