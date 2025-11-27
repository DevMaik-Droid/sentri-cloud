from .terraform_service import TerraformService
from .ansible_service import AnsibleService
from .proxmox_api import ProxmoxAPI
from .vmid_generator import VMIDGenerator
import time

class LXCManager:

    @staticmethod
    def create_lxc_for_project(project_id):

        # 1. Generar VMID único
        vmid = VMIDGenerator.generate()

        # 2. Crear LXC por Terraform
        TerraformService.create_lxc(vmid, project_id)

        # 3. Obtener IP del LXC
        proxmox = ProxmoxAPI()
        ip = None

        for i in range(20):
            ip = proxmox.get_lxc_ip(vmid)
            if ip:
                break
            time.sleep(3)

        if not ip:
            raise Exception("No se pudo obtener IP del LXC")

        # 4. Provisionar LXC con Ansible
        AnsibleService.configure_lxc(ip)

        return {
            "vmid": vmid,
            "ip": ip
        }
