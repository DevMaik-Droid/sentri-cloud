import subprocess
import os
import random

class DockerBuilder:

    @staticmethod
    def generate_dockerfile(runtime, path, framework=None, entrypoint=None):
        dockerfile = f"{path}/Dockerfile"

        if runtime == "nodejs":
            # Detect Next.js vs Express vs SPA
            if framework == "next":
                content = """
                FROM node:24-alpine3.22 AS builder
                WORKDIR /app
                COPY package*.json ./
                RUN npm install
                COPY . .
                RUN npm run build

                FROM node:24-alpine3.22
                WORKDIR /app
                COPY --from=builder /app/public ./public
                COPY --from=builder /app/.next ./.next
                COPY --from=builder /app/package*.json ./
                RUN npm install --omit=dev
                EXPOSE 3000
                CMD ["npm","start"]
                """

            elif framework == "express":
                content = """
                FROM node:24-alpine3.22
                WORKDIR /app
                COPY package*.json ./
                RUN npm install --production
                COPY . .
                EXPOSE 3000
                CMD ["node","server.js"]
                """

            else:  # React/Vue static
                content = """
                FROM node:24-alpine3.22 AS build
                WORKDIR /app
                COPY . .
                RUN npm install && npm run build

                FROM nginx:alpine
                COPY --from=build /app/dist /usr/share/nginx/html
                EXPOSE 80
                """

        elif runtime == "python":
            # Detect FastAPI vs Django vs Flask
            if framework == "fastapi":
                content = """
                FROM python:3.12-slim
                WORKDIR /app
                COPY . .
                RUN pip install --no-cache-dir -r requirements.txt
                EXPOSE 8000
                CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
                """

            elif framework == "django":
                content = """
                FROM python:3.12-slim
                WORKDIR /app
                COPY . .
                RUN pip install --no-cache-dir -r requirements.txt
                EXPOSE 8000
                CMD ["gunicorn", "projectname.wsgi:application", "--bind", "0.0.0.0:8000"]
                """

            else:  # generic python
                ep = entrypoint or "main.py"
                content = f"""
                FROM python:3.12-slim
                WORKDIR /app
                COPY . .
                RUN pip install -r requirements.txt
                EXPOSE 8000
                CMD ["python", "{ep}"]
                """

        elif runtime == "php":
            content = """
            FROM php:8.2-apache
            RUN docker-php-ext-install pdo pdo_mysql mysqli
            COPY . /var/www/html
            EXPOSE 80
            """

        elif runtime == "java":
            content = """
            FROM maven:3.9.6-eclipse-temurin-17 AS build
            WORKDIR /app
            COPY . .
            RUN mvn -q package -DskipTests

            FROM eclipse-temurin:17-jre
            WORKDIR /app
            COPY --from=build /app/target/*.jar app.jar
            EXPOSE 8080
            CMD ["java", "-jar", "app.jar"]
            """

        else:
            content = """
            FROM nginx:alpine3.22
            COPY . /usr/share/nginx/html
            EXPOSE 80
            """

        with open(dockerfile, "w") as f:
            f.write(content.strip())

        return dockerfile


    @staticmethod
    def build_image(project_id, path):
        image = f"sentri_project_{project_id}".lower()
        subprocess.run(["docker", "build", "-t", image, path], check=True)
        return image

    @staticmethod
    def run_container_traefik(project_id, image, domain, internal_port=80, runtime="nodejs"):
        """
        Lanza el contenedor con Labels de Traefik para enrutar automáticamente.
        NO expone puertos.
        NO usa nginx.
        """
        if runtime == "nodejs":
            internal_port = 3000

        container = f"sentri_project_{project_id}".lower()

        # eliminar contenedor previo
        subprocess.run(
            ["docker", "rm", "-f", container],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # labels traefik
        labels = {
            "traefik.enable": "true",
            f"traefik.http.routers.p{project_id}.rule": f"Host(`{domain}`)",
            
            f"traefik.http.services.p{project_id}.loadbalancer.server.port": str(internal_port)
        }

        label_args = []
        for k, v in labels.items():
            label_args.extend(["-l", f"{k}={v}"])

        # comando docker
        cmd = [
            "docker", "run", "-d",
            "--name", container,
            "--network", "sentri_net",
            "--restart", "always"
        ] + label_args + [
            image
        ]

        subprocess.run(cmd, check=True)

        return True
    

    @staticmethod
    def run_on_lxc(ip, image, project_id, internal_port=80, runtime="nodejs"):
        if runtime == "nodejs":
            internal_port = 3000

        container = f"sentri_project_{project_id}".lower()

        # comando remoto
        ssh = ["ssh", f"deploy@{ip}", "-o", "StrictHostKeyChecking=no"]

        # eliminar contenedor previo
        subprocess.run(ssh + [
            f"docker rm -f {container} || true"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # correr contenedor
        subprocess.run(ssh + [
            f"docker run -d --name {container} -p 80:{internal_port} {image}"
        ], check=True)

        return True
    
    @staticmethod
    def push_to_lxc(image, ip):
        # guardar imagen en un archivo temporal
        subprocess.run(["docker", "save", image, "-o", "image.tar"], check=True)

        # enviar al LXC
        subprocess.run(["scp", "-o", "StrictHostKeyChecking=no",
                        "image.tar", f"deploy@{ip}:/tmp/image.tar"], check=True)

        # cargar imagen en el LXC
        subprocess.run(["ssh", f"deploy@{ip}", "-o", "StrictHostKeyChecking=no",
                        "docker load -i /tmp/image.tar"], check=True)

        # eliminar temporal en el core
        subprocess.run(["rm", "image.tar"], stdout=subprocess.DEVNULL)

        return True
