from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.generate_pdf import generate_pdf 
import httpx  

router = APIRouter()

API_URL = "http://185.209.21.152:8000/result/by-uuid"


@router.get("/generate_pdf/{fileUuid}", response_class=FileResponse)
async def get_pdf(fileUuid: str):
    try:
        url = f"{API_URL}/{fileUuid}"
        print(f"📡 Отправляем асинхронный запрос: {url}")

        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5) 
        print("📥 Ответ API получен!")

        if response.status_code != 200:
            print(f"⚠️ Ошибка API: {response.status_code} {response.text}")
            raise HTTPException(status_code=500, detail="Failed to retrieve analysis result")

        data = response.json()
        ai_percentage = data.get("result", "0%")
        filename=data.get("filename")
        print(f"📊 AI Probability: {ai_percentage}")

        pdf_path = generate_pdf(filename, ai_percentage)

        return FileResponse(pdf_path, filename=f"{filename}_report.pdf", media_type="application/pdf")

    except httpx.TimeoutException:
        print("⏳ API завис! Возвращаем ошибку.")
        raise HTTPException(status_code=504, detail="API timeout")

    except Exception as e:
        print(f"❌ Ошибка в get_pdf: {e}")
        raise HTTPException(status_code=500, detail=str(e))
