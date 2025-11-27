import os
import zipfile
import shutil

class ProjectExtractor:

    @staticmethod
    def extract_and_normalize(zip_path: str):
        """
        Extrae un ZIP y normaliza la estructura:
        - Elimina carpetas basura (__MACOSX)
        - Si hay 1 sola carpeta raíz, mueve su contenido al nivel principal
        - Si hay carpetas anidadas innecesariamente, las aplana
        - Remueve archivos ocultos de sistema
        """
        base_dir = zip_path.replace(".zip", "")
        os.makedirs(base_dir, exist_ok=True)

        # 1. EXTRAER ZIP
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(base_dir)

        # 2. REMOVER CARPETAS BASURA (macOS, Windows)
        trash = ["__MACOSX", ".DS_Store", "Thumbs.db"]
        for root, dirs, files in os.walk(base_dir):
            for d in dirs:
                if d in trash:
                    shutil.rmtree(os.path.join(root, d), ignore_errors=True)
            for f in files:
                if f in trash:
                    os.remove(os.path.join(root, f))

        # 3. DETECTAR SI ToDO ESTÁ DENTRO DE UNA SOLA CARPETA
        items = [i for i in os.listdir(base_dir) if not i.startswith(".")]

        # Caso típico: Proyecto-main/
        if len(items) == 1 and os.path.isdir(os.path.join(base_dir, items[0])):
            inner = os.path.join(base_dir, items[0])

            # Mover contenido a raíz
            for f in os.listdir(inner):
                shutil.move(os.path.join(inner, f), base_dir)

            shutil.rmtree(inner)

        # 4. SI TIENE CARPETAS ANIDADAS (Proyecto/Proyecto/*)
        normalization_rounds = 0
        while True:
            items = [i for i in os.listdir(base_dir) if not i.startswith(".")]
            if len(items) == 1 and os.path.isdir(os.path.join(base_dir, items[0])):
                inner = os.path.join(base_dir, items[0])
                for f in os.listdir(inner):
                    shutil.move(os.path.join(inner, f), base_dir)
                shutil.rmtree(inner)
                normalization_rounds += 1
                if normalization_rounds > 3:
                    break
            else:
                break

        return base_dir
