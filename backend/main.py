from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from routes import users
from database import Base, engine
from routes.upload_routes import router as upload_router
from routes.results import router as result_router
from routes.generate_pdf_routes import router as generate_pdf_router
from routes.trainiig_routes import router as training_data_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/statics", StaticFiles(directory="frontend/build/src/statics"), name="statics")

@app.get("/")
def read_index():
    return FileResponse("frontend/build/src/index.html")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(users.router)
app.include_router(upload_router)
app.include_router(result_router) 
app.include_router(generate_pdf_router) 
app.include_router(training_data_router)


