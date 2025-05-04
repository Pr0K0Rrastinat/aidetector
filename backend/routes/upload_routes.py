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
            file_uuid_str = str(uuid.uuid4()) # Генерируем UUID
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

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

            new_file = UploadedFile(
                filename=file.filename,
                filepath=file_path,
                user_email=email,
                filetype=filetype,
                file_uuid=file_uuid_str # Сохраняем UUID
            )
            db.add(new_file)
            db.commit()
            db.refresh(new_file)

            file_result = Result(
                filename=file.filename,
                result=f"{model_result}%",
                user_email=email,
                filetype=filetype,
                file_uuid=file_uuid_str # Сохраняем UUID
            )
            db.add(file_result)
            db.commit()

            db.query(UploadedFile).filter(UploadedFile.filename == file.filename).delete()
            db.commit()

            if os.path.exists(file_path):
                os.remove(file_path)

            saved_results.append({
                "filename": file.filename,
                "result": f"{model_result}%",
                "filetype": filetype,
                "file_uuid": file_uuid_str # Возвращаем UUID на фронтенд
            })

        return {"results": saved_results}
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Server error: {str(e)}")

@router.get("/")
def get_uploaded_files(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).all()
    return {"files": [{"filename": file.filename, "filepath": file.filepath, "uploaded_at": file.uploaded_at, "user_email": file.user_email, "filetype": file.filetype} for file in files]}

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