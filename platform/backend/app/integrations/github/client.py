import httpx
from app.core.config import settings

class GithubOAuth:

    @staticmethod
    async def exchange_code_for_token(code: str) -> str:
        payload = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.GITHUB_REDIRECT_URL,
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://github.com/login/oauth/access_token",
                data=payload,
                headers={"Accept": "application/json"},
            )

        data = res.json()
        print("⚠ DEBUG GITHUB TOKEN RESPONSE:", data)  # <--- agrega esto

        if "access_token" not in data:
            raise Exception(f"GitHub Error: {data}")

        return data["access_token"]


    
    @staticmethod
    async def get_user_info(access_token: str):
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"}
            )
        return res.json()


    @staticmethod
    async def get_primary_email(access_token: str):
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"}
            )
        data = res.json()

        for email_data in data:
            if email_data.get("primary") and email_data.get("verified"):
                return email_data["email"]

        # fallback si no existe correo verificado
        return data[0]["email"]
