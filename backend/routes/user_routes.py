from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserResponse,Token
from services.user_service import create_user, get_user_by_email
from services import auth_service


router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="User already exists")
    db_user = create_user(db=db, user=user)  

    # Аутентифицируем нового пользователя и создаем токен
    access_token = auth_service.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
