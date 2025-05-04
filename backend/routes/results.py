import os
from fastapi import APIRouter, UploadFile, File, Depends, Form,HTTPException
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from models import UploadedFile,Result
from datetime import datetime
from schemas import FileResponse, ResultResponse
import logging

router = APIRouter(tags=["Results"])
logger = logging.getLogger(__name__)

@router.get("/result/by-filename/{filename}", response_model=ResultResponse)
def get_result_by_filename(filename: str, db: Session = Depends(get_db)):
    file_result = db.query(Result).filter(Result.filename == filename).first()
    if not file_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {
        "filename": file_result.filename,
        "result": file_result.result,
        "user_email": file_result.user_email,
        "filetype": file_result.filetype
    }

@router.get("/result/by-uuid/{file_uuid}", response_model=ResultResponse)
def get_result_by_uuid(file_uuid: str, db: Session = Depends(get_db)):
    file_result = db.query(Result).filter(Result.file_uuid == file_uuid).first()
    if not file_result:
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        "filename": file_result.filename,
        "result": file_result.result,
        "user_email": file_result.user_email,
        "filetype": file_result.filetype,
        "file_uuid": file_result.file_uuid
    }

@router.get("/result/by-email/{user_email}")
async def get_results_by_email(user_email: str, db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_email == user_email).all()
    
    if not results:
        raise HTTPException(status_code=404, detail="No results or files found for this email")

    return {
        "email": user_email,
        "results": [{"filename": result.filename, "result": result.result,"filetype":result.filetype} for result in results]
    }

@router.post("/result/delete/{user_email}/{fileUuid}", status_code=status.HTTP_204_NO_CONTENT)
async def result_delete(user_email: str, fileUuid: str, db: Session = Depends(get_db)):
    logger.info(f"Attempting to delete result: user_email={user_email}, filename={fileUuid}")

    try:
        file_result = db.query(Result).filter(
            Result.file_uuid == fileUuid,
            Result.user_email == user_email
        ).first()

        if not file_result:
            logger.warning(f"No result found for deletion: user_email={user_email}, filename={fileUuid}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")

        db.delete(file_result)
        db.commit()

        logger.info(f"Successfully deleted result: user_email={user_email}, filename={fileUuid}")

    except Exception as e:
        logger.error(f"Error deleting result: user_email={user_email}, filename={fileUuid}, error={str(e)}")
        db.rollback()