from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import TrainingData
import os
import shutil
from datetime import datetime
from services.model_service import train_model_from_db
from fastapi.responses import JSONResponse

TRAINING_FOLDER = "training_data"
os.makedirs(TRAINING_FOLDER, exist_ok=True)

router = APIRouter(prefix="/training-data", tags=["Training Data"])

@router.post("/")
async def upload_training_data(
    filetype: str = Form(...),
    email: str = Form(None),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    saved_files = []
    for file in files:
        file_path = os.path.join(TRAINING_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        training_data = TrainingData(
            filename=file.filename,
            filepath=file_path,
            user_email=email,
            filetype=filetype,
        )
        db.add(training_data)
        db.commit()
        db.refresh(training_data)

        saved_files.append({
            "filename": file.filename,
            "filepath": file_path,
            "uploaded_at": training_data.uploaded_at,
            "filetype": filetype
        })

    # 🧠 Автоматический запуск обучения, если >= 100 файлов
    total_files = db.query(TrainingData).count()
    if total_files >= 100:
        print(f"🚀 Всего файлов: {total_files}. Запуск обучения модели...")
        train_model_from_db(db)
        training_started = True
    else:
        training_started = False

    return JSONResponse({
        "message": "Файлы успешно загружены",
        "training_started": training_started,
        "total_files": total_files,
        "data": saved_files
    })

@router.post("/train-from-db")
def train_from_db_route(db: Session = Depends(get_db)):
    return train_model_from_db(db)

@router.get("/")
def get_training_data(db: Session = Depends(get_db)):
    data = db.query(TrainingData).all()
    return {"training_data": [
        {
            "filename": d.filename,
            "filepath": d.filepath,
            "uploaded_at": d.uploaded_at,
            "user_email": d.user_email,
            "filetype": d.filetype
        } for d in data
    ]}
