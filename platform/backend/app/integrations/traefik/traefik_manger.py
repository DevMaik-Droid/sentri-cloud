import os
import yaml

class TraefikManager:
    BASE_PATH = "/opt/sentri-core/platform/deployer/dynamic/projects"

    @staticmethod
    def ensure_path():
        if not os.path.exists(TraefikManager.BASE_PATH):
            os.makedirs(TraefikManager.BASE_PATH, exist_ok=True)

    @staticmethod
    def register_project_route(project_id, domain, lxc_ip):
        TraefikManager.ensure_path()

        path = f"{TraefikManager.BASE_PATH}/p{project_id}.yml"

        config = {
            "http": {
                "routers": {
                    f"p{project_id}": {
                        "rule": f"Host(`{domain}`)",
                        "service": f"p{project_id}",
                        "entryPoints": ["web"],
                    }
                },
                "services": {
                    f"p{project_id}": {
                        "loadBalancer": {
                            "servers": [
                                {"url": f"http://{lxc_ip}:80"}
                            ]
                        }
                    }
                }
            }
        }

        with open(path, "w") as f:
            yaml.dump(config, f, sort_keys=False)

        print(f"Traefik: ruta agregada → {path}")

        return True

    @staticmethod
    def remove_project_route(project_id):
        path = f"{TraefikManager.BASE_PATH}/p{project_id}.yml"
        if os.path.exists(path):
            os.remove(path)
            print(f"Traefik: ruta eliminada → p{project_id}.yml")
        return True
