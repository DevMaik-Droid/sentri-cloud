from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth.router import router as auth_router
from app.api.v1.projects.router import router as projects_router

app = FastAPI(
    title="sentri-cloud API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Endpoint raíz simple
@app.get("/")
async def root():
    return {
        "message": "🚀 SentriCloud API activa",
    }
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(projects_router, prefix="/api/v1/projects")

