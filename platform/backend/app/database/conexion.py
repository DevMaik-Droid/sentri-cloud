from .database import Database

class Conexion:
    """
    Context manager asíncrono que obtiene y libera automáticamente una conexión.
    Ejemplo:
        async with Conexion() as conn:
            rows = await conn.fetch("SELECT * FROM cameras;")
    """
    def __init__(self):
        self._conexion = None

    async def __aenter__(self):
        self._conexion = await Database.obtener_conexion()
        return self._conexion

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await Database.devolver_conexion(self._conexion)
        self._conexion = None
