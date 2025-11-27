from pydantic import BaseModel

class DeployResponse(BaseModel):
    status: str
    dominio: str
    runtime: str
