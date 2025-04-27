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
async def upload_files(
    email: str = Form(...),
    files: list[UploadFile] = File(...),
    filetype: str = Form(...),
    db: Session = Depends(get_db)
):

    saved_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        file_content = await file.read()
        file_content_str = file_content.decode('utf-8', errors='ignore')  

        print(f"File content (first 100 chars): {file_content_str[:100]}")

        try:
            prediction = predict(file_content_str)
            
            print(f"Prediction: {prediction}")
            
            model_result = round(prediction[0][1].item(), 2) 
        except Exception as e:
            # В случае ошибки, выводим сообщение об ошибке
            print(f"Error during prediction: {e}")
            raise HTTPException(status_code=400, detail="Ошибка обработки файла: не поддерживаемый формат или ошибка модели.")

        new_file = UploadedFile(filename=file.filename, filepath=file_path, user_email=email, filetype=filetype)
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        saved_files.append({"filename": file.filename, "filepath": file_path, "user_email": email})

        file_result = Result(
            filename=file.filename,
            result=f"{model_result}%",
            user_email=email,
            filetype=filetype,
        )
        db.add(file_result)
        db.commit()

        db.query(UploadedFile).filter(UploadedFile.filename == file.filename).delete()
        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

        return {"filename": file.filename, "filepath": file_path, "result": f"{model_result}%", "filetype": filetype}

@router.get("/")
def get_uploaded_files(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).all()
    return {"files": [{"filename": file.filename, "filepath": file.filepath, "uploaded_at": file.uploaded_at, "user_email": file.user_email, "filetype": file.filetype} for file in files]}

