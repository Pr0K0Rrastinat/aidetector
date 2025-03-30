import os
from fastapi import APIRouter, UploadFile, File, Depends, Form,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UploadedFile,Result
from datetime import datetime
import random
from schemas import FileResponse, ResultResponse


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["Uploads"])

@router.post("/")
async def upload_files(
    email: str = Form(...),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    #Here connect to ml 
    random_result = round(random.uniform(50, 100), 2)

    saved_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        new_file = UploadedFile(filename=file.filename, filepath=file_path, user_email=email)
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        saved_files.append({"filename": file.filename, "filepath": file_path, "user_email": email})

        file_result = Result(filename=file.filename, result=f"{random_result}%", user_email=email)
        db.add(file_result)
        db.commit()

        db.query(UploadedFile).filter(UploadedFile.filename == file.filename).delete()
        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

    return {"filename": file.filename, "filepath": file_path, "result": f"{random_result}%"}

@router.get("/")
def get_uploaded_files(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).all()
    return {"files": [{"filename": file.filename, "filepath": file.filepath, "uploaded_at": file.uploaded_at,"user_email":file.user_email} for file in files]}

