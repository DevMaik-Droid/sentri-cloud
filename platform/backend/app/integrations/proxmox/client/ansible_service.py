import subprocess
import os

ANSIBLE_PLAYBOOK = "/opt/sentri-core/infra/ansible/lxc_free/playbook.yml"

class AnsibleService:

    @staticmethod
    def configure_lxc(ip):
        inventory = f"{ip},"

        cmd = [
            "ansible-playbook",
            "-i", inventory,
            ANSIBLE_PLAYBOOK,
            "--ssh-common-args='-o StrictHostKeyChecking=no'"
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, shell=False)

        if result.returncode != 0:
            raise Exception("Error Ansible LXC: " + result.stderr)

        return True
