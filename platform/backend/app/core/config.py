from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # ============================================
    # ENTORNO GENERAL
    # ============================================
    ENV: str = "development"
    DEBUG: bool = True
    PROJECT_NAME: str = "Sentri Cloud API"

    # ============================================
    # BASE DE DATOS (asyncpg)
    # ============================================
    DATABASE_URL: str

    FRONTEND_URL: str

    # ============================================
    # JWT
    # ============================================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 12

    # ============================================
    # GitHub OAuth
    # ============================================
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URL: str

    # ============================================
    # CRIPTOGRAFÍA PARA ENCRIPTAR TOKEN DE GITHUB
    # ============================================
    CRYPTO_SECRET_KEY: str



@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
