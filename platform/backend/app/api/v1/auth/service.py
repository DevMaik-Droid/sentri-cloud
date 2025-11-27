from fastapi.responses import RedirectResponse
from app.integrations.github.client import GithubOAuth
from app.api.v1.users.repository import UsuariosRepository
from app.core.security import crear_token_jwt
from app.core.crypto import encrypt_value
from app.core.config import settings
class AuthService:

    @staticmethod
    async def github_login(code: str):
        # 1. Obtener access token desde GitHub
        access_token = await GithubOAuth.exchange_code_for_token(code)

        # 2. Obtener información del usuario desde GitHub
        gh_user = await GithubOAuth.get_user_info(access_token)

        github_id = str(gh_user["id"])
        github_username = gh_user["login"]
        github_avatar = gh_user["avatar_url"]

        # Los correos requieren llamada extra
        email = await GithubOAuth.get_primary_email(access_token)

        # 3. Buscar usuario por github_id
        existente = await UsuariosRepository.obtener_por_github_id(github_id)

        if existente:
            # actualizar token
            await UsuariosRepository.actualizar_token_github(
                existente["id"],
                encrypt_value(access_token)
            )

            token = crear_token_jwt({"sub": str(existente["id"])})
            redirect_url = f"{settings.FRONTEND_URL}/auth/callback?token={token}"
            return RedirectResponse(url=redirect_url, status_code=302)
            

        # 4. Si no existe, crear nuevo usuario
        nuevo = await UsuariosRepository.crear_usuario_github(
            correo=email,
            nombre=github_username,
            avatar=github_avatar,
            github_id=github_id,
            github_usuario=github_username,
            github_token_encriptado=encrypt_value(access_token)
        )

        token = crear_token_jwt({"sub": str(nuevo["id"])})
        redirect_url = f"{settings.FRONTEND_URL}/auth/callback?token={token}"
        return RedirectResponse(url=redirect_url, status_code=302)
