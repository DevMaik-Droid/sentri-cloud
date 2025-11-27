from app.database.conexion import Conexion

class UsuariosRepository:

    @staticmethod
    async def obtener_por_github_id(github_id):
        sql = "SELECT * FROM usuarios WHERE github_id = $1"

        async with Conexion() as conn:
            row = await conn.fetchrow(sql, github_id)

        return dict(row) if row else None
    
    @staticmethod
    async def crear_usuario_github(
        correo, nombre, avatar, github_id, github_usuario, github_token_encriptado
    ):
        async with Conexion() as db:
            row = await db.fetchrow(
                """
                INSERT INTO usuarios 
                (correo, nombre, avatar_url, github_id, github_usuario, github_token_encriptado, correo_verificado)
                VALUES ($1, $2, $3, $4, $5, $6, TRUE)
                RETURNING *
                """,
                correo, nombre, avatar, github_id, github_usuario, github_token_encriptado
            )
        return dict(row)

    @staticmethod
    async def actualizar_token_github(id, github_token_encriptado):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE usuarios
                SET github_token_encriptado = $1
                WHERE id = $2
                """,
                github_token_encriptado, id
            )

    @staticmethod
    async def obtener_token_github(id):
        async with Conexion() as db:
            row = await db.fetchrow(
                """
                SELECT github_token_encriptado FROM usuarios
                WHERE id = $1
                """,
                id
            )
        return dict(row)