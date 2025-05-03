from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from routes import users
from database import Base, engine
from routes.upload_routes import router as upload_router
from routes.results import router as result_router
from routes.generate_pdf_routes import router as generate_pdf_router
from routes.trainiig_routes import router as training_data_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "../frontend/build/static")
INDEX_PATH = os.path.join(BASE_DIR, "../frontend/build/index.html")

if not os.path.exists(STATIC_DIR):
    print("⚠️ STATIC_DIR не найден:", STATIC_DIR)
if not os.path.exists(INDEX_PATH):
    print("⚠️ index.html не найден:", INDEX_PATH)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def read_index():
    return FileResponse(INDEX_PATH)

# fallback for React Router
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(INDEX_PATH)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем все роутеры
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(users.router)
app.include_router(upload_router)
app.include_router(result_router) 
app.include_router(generate_pdf_router) 
app.include_router(training_data_router)
