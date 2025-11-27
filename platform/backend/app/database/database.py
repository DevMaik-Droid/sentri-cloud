import os
import asyncpg
from urllib.parse import urlparse
from app.core.config import settings
class Database:
    _pool = None

    @classmethod
    async def inicializar_pool(cls):
        """
        Inicializa el pool de conexiones asyncpg solo una vez.
        Lee la URL desde la variable URL_DATABASE o DATABASE_URL.
        """
        if cls._pool:
            return cls._pool

        
        url = settings.DATABASE_URL

        if not url:
            raise ValueError("❌ No se encontró la variable URL_DATABASE o DATABASE_URL en el entorno.")

        parsed = urlparse(url)

        try:
            cls._pool = await asyncpg.create_pool(
                user=parsed.username,
                password=parsed.password,
                database=parsed.path.lstrip("/"),
                host=parsed.hostname,
                port=parsed.port or 5432,
                min_size=1,
                max_size=10,
                command_timeout=60,
            )
            print("✅ Pool asyncpg inicializado correctamente.")
            return cls._pool

        except Exception as e:
            print(f"❌ Error al inicializar el pool asyncpg: {e}")
            raise e

    @classmethod
    async def obtener_conexion(cls):
        """
        Obtiene una conexión activa del pool (espera si no hay disponible).
        """
        if cls._pool is None:
            await cls.inicializar_pool()
        return await cls._pool.acquire()

    @classmethod
    async def devolver_conexion(cls, conexion):
        """
        Devuelve la conexión al pool.
        """
        if cls._pool and conexion:
            try:
                await cls._pool.release(conexion)
            except Exception as e:
                print(f"⚠️ Error al liberar conexión: {e}")

    @classmethod
    async def cerrar_pool(cls):
        """
        Cierra todas las conexiones del pool (llamar en shutdown).
        """
        if cls._pool:
            await cls._pool.close()
            cls._pool = None
            print("🛑 Pool asyncpg cerrado correctamente.")
