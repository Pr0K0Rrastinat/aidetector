from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.generate_pdf import generate_pdf
import httpx
import json

router = APIRouter()

API_URL = "http://185.209.21.152:8000/result/by-uuid"


@router.get("/generate_pdf/{fileUuid}", response_class=FileResponse)
async def get_pdf(fileUuid: str):
    try:
        url = f"{API_URL}/{fileUuid}"
        print(f"📡 Отправляем асинхронный запрос: {url}")

        headers = {"accept": "application/json"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5, headers=headers)
        print(f"📥 Ответ API получен! Статус: {response.status_code}")
        print(f"📝 Тело ответа API: {response.text}")

        if response.status_code != 200:
            print(f"⚠️ Ошибка API: {response.status_code} {response.text}")
            raise HTTPException(status_code=500, detail="Failed to retrieve analysis result")

        try:
            data = response.json()
            print(f"✅ Данные JSON успешно распарсены: {data}")
            ai_percentage = data.get("result", "0%")
            filename = data.get("filename")
            print(f"📊 AI Probability: {ai_percentage}, Filename: {filename}, FileUuid: {fileUuid}") #Добавил вывод fileUuid

            if filename is None:
                raise HTTPException(status_code=500, detail="Filename not found in API response")
            if ai_percentage is None:
                raise HTTPException(status_code=500, detail="AI probability not found in API response")

            pdf_path = generate_pdf(filename, ai_percentage, fileUuid)  # Передаем fileUuid в generate_pdf
            return FileResponse(pdf_path, filename=f"{filename}_report.pdf", media_type="application/pdf")

        except json.JSONDecodeError as e:
            print(f"❌ Ошибка парсинга JSON: {e}")
            raise HTTPException(status_code=500, detail=f"Error parsing API response: {e}")
        except Exception as e:
            print(f"❌ Ошибка обработки данных: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    except httpx.TimeoutException:
        print("⏳ API завис! Возвращаем ошибку.")
        raise HTTPException(status_code=504, detail="API timeout")

    except Exception as e:
        print(f"❌ Ошибка в get_pdf: {e}")
        raise HTTPException(status_code=500, detail=str(e))