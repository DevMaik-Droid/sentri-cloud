import bcrypt
from fastapi import HTTPException, Request
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "super-secreto"
ALGORITHM = "HS256"



async def get_current_user(request: Request):
    auth = request.headers.get('Authorization')
    if not auth:
        raise HTTPException(status_code=401, detail="Falta token")

    token = auth.split(" ")[1]
    decoded = verificar_token_jwt(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Token no valido")
    decoded["token"] = token
    return decoded

def hash_contrasena(contrasena: str) -> str:
    return bcrypt.hashpw(contrasena.encode(), bcrypt.gensalt()).decode()

def verificar_contrasena(contrasena: str, hash_almacenado: str) -> bool:
    return bcrypt.checkpw(contrasena.encode(), hash_almacenado.encode())

def crear_token_jwt(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.now() + timedelta(hours=12)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token_jwt(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

