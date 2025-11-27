import datetime
from pydantic import BaseModel


class Usuario(BaseModel):
    id: int
    nombre : str
    avatar_url : str
    github_id : str
    github_usuario : str
    github_token_encriptado : str
    correo_verificado : bool
    creado_en : datetime
    actualizado_en : datetime
    ultimo_ingreso : datetime