import os
from fastapi import APIRouter, UploadFile, File, Depends, Form,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UploadedFile,Result
from datetime import datetime
import random
from schemas import FileResponse, ResultResponse

router = APIRouter(tags=["Results"])

@router.get("/result/by-filename/{filename}", response_model=ResultResponse)
def get_result_by_filename(filename: str, db: Session = Depends(get_db)):
    file_result = db.query(Result).filter(Result.filename == filename).first()
    if not file_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {"filename": file_result.filename, "result": file_result.result, "user_email": file_result.user_email}

@router.get("/result/by-email/{user_email}")
async def get_results_by_email(user_email: str, db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_email == user_email).all()
    
    if not results:
        raise HTTPException(status_code=404, detail="No results or files found for this email")

    return {
        "email": user_email,
        "results": [{"filename": result.filename, "result": result.result} for result in results]
    }
