import subprocess

NGINX_PATH = "/etc/nginx/conf.d"

class NginxManager:

    @staticmethod
    def register(domain, port):
        config = f"""
        server {{
            listen 80;
            server_name {domain};

            location / {{
                proxy_pass http://localhost:{port};
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
            }}
        }}
        """

        file_path = f"{NGINX_PATH}/{domain}.conf"
        with open(file_path, "w") as f:
            f.write(config)

        subprocess.run(["nginx", "-s", "reload"], check=True)
