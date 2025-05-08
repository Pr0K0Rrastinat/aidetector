from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate
from utils.security import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    if len(user.password) < 6:
        raise ValueError("Пароль должен содержать минимум 6 символов")

    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
