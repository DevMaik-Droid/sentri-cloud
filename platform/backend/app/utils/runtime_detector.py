import os
import zipfile
import uuid

class RuntimeDetector:

    @staticmethod
    def extract(zip_path):
        out = f"/app/data/builds/{uuid.uuid4()}"
        os.makedirs(out, exist_ok=True)
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(out)
        return out

    def detect_runtime(path):
        files = os.listdir(path)

        # Node.js
        if "package.json" in files:
            return "nodejs"

        # Python
        if "requirements.txt" in files or "pyproject.toml" in files:
            return "python"

        # PHP
        if "composer.json" in files or any(f.endswith(".php") for f in files):
            return "php"

        # Java
        if "pom.xml" in files or "build.gradle" in files:
            return "java"

        # HTML static
        if any(f.endswith(".html") for f in files):
            return "static"

        return "unknown"
    
    def detect_framework(path, runtime):
        files = os.listdir(path)

        # ---- NODE FRAMEWORKS ----
        if runtime == "nodejs":
            if "next.config.js" or "next.config.ts" in files:
                return "next"
            if "vite.config.js" or "vite.config.ts" in files:
                return "vite"

            # Express detection
            if os.path.exists(os.path.join(path, "server.js")):
                return "express"
            if os.path.exists(os.path.join(path, "app.js")):
                return "express"

            # React/Vue/Svelte (SPA)
            if os.path.exists(os.path.join(path, "src")) and \
            os.path.exists(os.path.join(path, "public")):
                return "spa"

            return "node_generic"

        # ---- PYTHON FRAMEWORKS ----
        if runtime == "python":
            # FastAPI
            if search_code(path, "fastapi"):
                return "fastapi"

            # Django
            if "manage.py" in files:
                return "django"

            # Flask
            if search_code(path, "flask"):
                return "flask"

            return "python_generic"

        # ---- PHP FRAMEWORKS ----
        if runtime == "php":
            if "artisan" in files:
                return "laravel"
            if "index.php" in files:
                return "php_generic"

            return "php_generic"

        # ---- JAVA FRAMEWORKS ----
        if runtime == "java":
            if search_code(path, "SpringApplication"):
                return "springboot"
            return "java_generic"

        return "unknown"

def search_code(path, keyword):
    for root, _, files in os.walk(path):
        for f in files:
            if f.endswith((".py", ".js", ".ts", ".java", ".php")):
                full = os.path.join(root, f)
                with open(full, 'r', errors='ignore') as txt:
                    if keyword.lower() in txt.read().lower():
                        return True
    return False

