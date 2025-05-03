import os
from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UploadedFile, Result
from datetime import datetime
from schemas import FileResponse, ResultResponse
from services.model_service import predict

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["Uploads"])

@router.post("/")
@router.post("/")
async def upload_files(
    email: str = Form(...),
    files: list[UploadFile] = File(...),
    filetype: str = Form(...),
    db: Session = Depends(get_db)
):
    saved_results = []
    try:
        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            # Нужно прочитать снова, потому что файл уже считан выше
            with open(file_path, "r", encoding='utf-8', errors='ignore') as f:
                file_content_str = f.read()

            print(f"File content (first 100 chars): {file_content_str[:100]}")

            try:
                prediction = predict(file_content_str)
                model_result = round(prediction[0][0].item(), 2)
                print(f"Prediction: {model_result}%")
            except Exception as e:
                print(f"Error during prediction: {e}")
                model_result = "Ошибка"

            # Сохраняем запись в UploadedFile
            new_file = UploadedFile(
                filename=file.filename,
                filepath=file_path,
                user_email=email,
                filetype=filetype
            )
            db.add(new_file)
            db.commit()
            db.refresh(new_file)

            # Сохраняем результат
            file_result = Result(
                filename=file.filename,
                result=f"{model_result}%",
                user_email=email,
                filetype=filetype,
            )
            db.add(file_result)
            db.commit()

            # Удаляем из таблицы и с диска
            db.query(UploadedFile).filter(UploadedFile.filename == file.filename).delete()
            db.commit()

            if os.path.exists(file_path):
                os.remove(file_path)

            # Добавляем результат в список
            saved_results.append({
                "filename": file.filename,
                "result": f"{model_result}%",
                "filetype": filetype    
            })

        return {"results": saved_results}
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Server error: {str(e)}")

@router.get("/")
def get_uploaded_files(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).all()
    return {"files": [{"filename": file.filename, "filepath": file.filepath, "uploaded_at": file.uploaded_at, "user_email": file.user_email, "filetype": file.filetype} for file in files]}

