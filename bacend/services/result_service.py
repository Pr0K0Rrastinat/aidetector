from sqlalchemy.orm import Session
from models import Result
from schemas import UserCreate


def get_reulst_by_email(db:Session,user_email:str):
    results = db.query(Result).filter(Result.user_email==user_email).all()
    return results
