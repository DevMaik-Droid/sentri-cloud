from fastapi import HTTPException
from .repository import ProyectosRepository
from app.utils.zip_handler import FilesUtils
from app.utils.runtime_detector import RuntimeDetector
from app.utils.docker_builder import DockerBuilder
from slugify import slugify
from app.utils.proyect_extractor import ProjectExtractor

from app.integrations.proxmox.client.lxc_manager import LXCManager
from app.integrations.traefik.traefik_manger import TraefikManager

class ProjectsService:

    @staticmethod
    async def upload_zip(usuario_id, nombre, archivo):

        slug = slugify(nombre)

        # crear proyecto inicial
        proyecto = await ProyectosRepository.crear_proyecto(
            usuario_id, nombre, slug,
            tipo_origen="zip",
            runtime="desconocido"
        )

        # guardar ZIP
        zip_path = await FilesUtils.save_zip(usuario_id, archivo)

        # actualizar zip_path en ajustes
        await ProyectosRepository.guardar_zip(proyecto["id"], zip_path)

        return {"id": proyecto["id"], "nombre": nombre, "slug": slug}

    @staticmethod
    async def deploy_project(project_id, usuario_id):

        # obtener proyecto
        proyecto = await ProyectosRepository.obtener_por_id(project_id, usuario_id)
        if not proyecto:
            raise HTTPException(404, "Proyecto no encontrado")
        

        # Crear LXC
        print(" 🚀 Creando LXC")
        lxc_info = LXCManager.create_lxc_for_project(project_id)
        print(" 🚀 LXC creado")
        lxc_ip = lxc_info["ip"]
        vmid = lxc_info["vmid"]

        # 3. Desplegar proyecto

        zip_path = proyecto["ajustes"]["zip_path"]
        if not zip_path:
            raise HTTPException(400, "Proyecto sin ZIP")

        # extraer código del ZIP
        project_dir = ProjectExtractor.extract_and_normalize(zip_path)

        # detectar runtime
        runtime = RuntimeDetector.detect_runtime(project_dir)
        framework = RuntimeDetector.detect_framework(project_dir, runtime)

        print("RUNTIME:", runtime)
        print("FRAMEWORK:", framework)


        # generar Dockerfile
        DockerBuilder.generate_dockerfile(runtime, project_dir, framework=framework)

        # 4. Construir imagen Docker
        image = DockerBuilder.build_image(project_id, project_dir)

        # 4.1 Guardar imagen en LXC
        print(" 🚀 Guardando imagen en LXC")
        DockerBuilder.push_to_lxc(image, lxc_ip)
        print(" 🚀 Imagen guardada en LXC")

        # 4.2 Correr contenedor en LXC
        print(" 🚀 Corriendo contenedor en LXC")
        DockerBuilder.run_on_lxc(lxc_ip, image, project_id, runtime=runtime)
        print(" 🚀 Contenedor corriendo en LXC")

        # 5. Definir dominio basado en el proyecto
        domain = f"p{project_id}.sentinel-guard.lat"

        print(" 🚀 Cargando Traefik")
        # 6. Correr contenedor con LABELS de Traefik (CLAVE)
        TraefikManager.register_project_route(project_id, domain, lxc_ip)


        print(" 🚀 Traefik cargado")

        # 7. Actualizar BD
        await ProyectosRepository.actualizar_dominio(project_id, domain, runtime)

        return {
            "message": "Proyecto desplegado exitosamente",
            "result": "ok",
            "data": {
               "dominio": f"https://{domain}",
               "runtime": runtime
            }
        }