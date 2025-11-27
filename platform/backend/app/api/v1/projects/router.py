import io
import os
from fastapi import APIRouter, Form, HTTPException, UploadFile, File, Depends
import httpx
from starlette.datastructures import UploadFile as StarletteUploadFile
from app.api.v1.users.repository import UsuariosRepository
from app.core.crypto import decrypt_value
from .service import ProjectsService
from app.core.security import get_current_user
from .models import GitHubRepo

GITHUB_API = "https://api.github.com"

router = APIRouter()

@router.post("/upload")
async def upload_project(
    nombre: str = Form(...),
    archivo: UploadFile = File(...),
    usuario=Depends(get_current_user)
):
    return await ProjectsService.upload_zip(usuario["sub"], nombre, archivo)


@router.post("/{project_id}/deploy")
async def deploy_project(project_id: str, usuario=Depends(get_current_user)):
    result = await ProjectsService.deploy_project(project_id, usuario["sub"])
    print(result)
    return result

@router.post("/github/upload")
async def upload_github_repo(request: GitHubRepo, usuario=Depends(get_current_user)):

    # 1. Obtener token desencriptado
    data = await UsuariosRepository.obtener_token_github(usuario["sub"])
    if not data:
        raise HTTPException(401, "Token GitHub no encontrado")

    token = decrypt_value(data["github_token_encriptado"])

    # 2. Descargar ZIP del repo (rama elegida)
    url = f"https://codeload.github.com/{request.owner}/{request.name}/zip/{request.branch}"

    headers = {"Authorization": f"Bearer {token}"}

    print("🚀 Descargando ZIP de GitHub:", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        if resp.status_code != 200:
            print("🔴 Error GitHub:", resp.status_code, resp.text)
            raise HTTPException(resp.status_code, "No se pudo descargar el repositorio")
    
    print("✅ ZIP descargado correctamente")

    # 3. Crear UploadFile simulado a partir del ZIP descargado
    zip_file = StarletteUploadFile(
        filename=f"{request.name}-{request.branch}.zip",
        file=io.BytesIO(resp.content),
    )

    # 4. Reutilizar la lógica principal (NO la tocas)
    return await ProjectsService.upload_zip(usuario["sub"], request.name, zip_file)
