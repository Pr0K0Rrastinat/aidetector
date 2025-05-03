from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserResponse
from services.user_service import create_user, get_user_by_email

router = APIRouter()

@router.post("/register", response_model=dict)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="User already exists")
    create_user(db=db, user=user)
    return {"message": "User created successfully"}
    