from app.database.conexion import Conexion
import json
class ProyectosRepository:

    # ============================================================
    # CREAR PROYECTO
    # ============================================================
    @staticmethod
    async def crear_proyecto(
        usuario_id: str,
        nombre: str,
        slug: str,
        tipo_origen: str,
        runtime: str,
        zip_path: str = None,
        github_repo_nombre: str = None,
        github_rama: str = None,
        auto_desplegar: bool = False,
        descripcion: str = None
    ):
        print("🚀 Creando proyecto...")
        print("🚀 Usuario:", usuario_id)
        print("🚀 Nombre:", nombre)
        print("🚀 Slug:", slug)
        print("🚀 Tipo origen:", tipo_origen)
        print("🚀 Runtime:", runtime)
        print("🚀 GitHub Repo Nombre:", github_repo_nombre)
        print("🚀 GitHub Rama:", github_rama)
        print("🚀 Auto Desplegar:", auto_desplegar
              
              )
        async with Conexion() as db:
            row = await db.fetchrow(
                """
                INSERT INTO proyectos (
                    usuario_id, nombre, slug, tipo_origen, runtime, 
                    github_repo_nombre, github_rama, auto_desplegar, descripcion, ajustes
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, '{}'::jsonb)
                RETURNING *
                """,
                usuario_id, nombre, slug, tipo_origen, runtime,
                github_repo_nombre, github_rama, auto_desplegar, descripcion
            )

        return dict(row)


    # ============================================================
    # OBTENER PROYECTO POR ID (USUARIO)
    # ============================================================
    @staticmethod
    async def obtener_por_id(proyecto_id: str, usuario_id: str):

        async with Conexion() as db:
            row = await db.fetchrow(
                """
                SELECT * FROM proyectos
                WHERE id = $1 AND usuario_id = $2
                """,
                proyecto_id, usuario_id
            )

        if not row:
            return None

        proyecto = dict(row)

        # ←← AQUI EL FIX CRÍTICO
        if isinstance(proyecto.get("ajustes"), str):
            try:
                proyecto["ajustes"] = json.loads(proyecto["ajustes"])
            except:
                proyecto["ajustes"] = {}

        return proyecto


    # ============================================================
    # LISTAR PROYECTOS DE UN USUARIO
    # ============================================================
    @staticmethod
    async def listar_por_usuario(usuario_id: str):
        async with Conexion() as db:
            rows = await db.fetch(
                """
                SELECT * FROM proyectos
                WHERE usuario_id = $1
                ORDER BY creado_en DESC
                """,
                usuario_id
            )
        return [dict(r) for r in rows]


    # ============================================================
    # ACTUALIZAR ESTADO DEL PROYECTO
    # ============================================================
    @staticmethod
    async def actualizar_estado(proyecto_id: str, estado: str):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE proyectos
                SET estado = $1,
                    actualizado_en = NOW()
                WHERE id = $2
                """,
                estado, proyecto_id
            )


    # ============================================================
    # ACTUALIZAR INFORMACIÓN DE DESPLIEGUE
    # ============================================================
    @staticmethod
    async def actualizar_datos_deploy(
        proyecto_id: str,
        url_publica: str,
        version_runtime: str = None
    ):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE proyectos
                SET url_publica = $1,
                    version_runtime = COALESCE($2, version_runtime),
                    actualizado_en = NOW()
                WHERE id = $3
                """,
                url_publica, version_runtime, proyecto_id
            )


    # ============================================================
    # ACTUALIZAR SOLO EL DOMINIO
    # ============================================================
    @staticmethod
    async def actualizar_dominio(proyecto_id: str, dominio: str, runtime: str = None):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE proyectos
                SET dominio_personalizado = $1, runtime = $2,
                    actualizado_en = NOW()
                WHERE id = $3
                """,
                dominio, runtime, proyecto_id
            )


    # ============================================================
    # GUARDAR ZIP EN EL REGISTRO DEL PROYECTO
    # ============================================================
    @staticmethod
    async def guardar_zip(proyecto_id: str, ruta_zip: str):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE proyectos
                SET ajustes = jsonb_set(ajustes, '{zip_path}', to_jsonb($1::text), true),
                    actualizado_en = NOW()
                WHERE id = $2
                """,
                ruta_zip, proyecto_id
            )


    # ============================================================
    # GUARDAR INFORMACIÓN DE GITHUB
    # (cuando proyecto tipo 'github')
    # ============================================================
    @staticmethod
    async def actualizar_github_info(
        proyecto_id: str,
        repo_nombre: str,
        rama: str,
        auto_desplegar: bool
    ):
        async with Conexion() as db:
            await db.execute(
                """
                UPDATE proyectos
                SET github_repo_nombre = $1,
                    github_rama = $2,
                    auto_desplegar = $3,
                    actualizado_en = NOW()
                WHERE id = $4
                """,
                repo_nombre, rama, auto_desplegar, proyecto_id
            )
