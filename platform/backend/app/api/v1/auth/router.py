from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
import httpx
from .schemas import TokenResponse
from .service import AuthService
from app.core.config import settings
from app.core.security import get_current_user, verificar_token_jwt
from app.api.v1.users.repository import UsuariosRepository
from app.core.crypto import decrypt_value

router = APIRouter()


GITHUB_API = "https://api.github.com"
@router.get("/github/login")
async def github_login():
    # Redirigir al usuario a GitHub OAuth
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URL}"
        f"&scope=repo%20user:email%20read:user"
    )
    return RedirectResponse(url)


@router.get("/github/callback", response_model=TokenResponse)
async def github_callback(code: str):
    return await AuthService.github_login(code)




@router.get("/github/repos")
async def get_github_repos(usuario=Depends(get_current_user)):

    data = await UsuariosRepository.obtener_token_github(usuario["sub"])


    if not data:
        raise HTTPException(status_code=401, detail="Token no valido")

    token_encriptado = data["github_token_encriptado"]

    token = decrypt_value(token_encriptado)
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        res = await client.get(f"{GITHUB_API}/user/repos?per_page=10&type=owner", headers=headers)
        repos = res.json()

    formatted_repos = []

    for repo in repos:
        formatted_repos.append({
            "id": repo["id"],
            "name": repo["name"],
            "fullName": repo["full_name"],
            "description": repo["description"],
            "language": repo["language"],
            "stars": repo["stargazers_count"],
            "branch": repo["default_branch"],
            "updatedAt": repo["updated_at"],
            "owner": repo["owner"]["login"]
        })

    return formatted_repos

