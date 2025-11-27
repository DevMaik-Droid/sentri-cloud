from pydantic import BaseModel, EmailStr

class RegistroSchema(BaseModel):
    correo: EmailStr
    contrasena: str
    nombre: str

class LoginSchema(BaseModel):
    correo: EmailStr
    contrasena: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
