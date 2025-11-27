import os
from uuid import uuid4

class FilesUtils:

    @staticmethod
    async def save_zip(usuario_id: str, archivo):
        folder = f"/app/data/proyectos/{usuario_id}"
        os.makedirs(folder, exist_ok=True)

        file_path = f"{folder}/{uuid4()}.zip"

        with open(file_path, "wb") as f:
            f.write(await archivo.read())

        return file_path
