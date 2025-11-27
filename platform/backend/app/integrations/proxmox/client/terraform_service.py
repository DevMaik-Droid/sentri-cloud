import subprocess

TF_LXC_PATH = "/opt/sentri-core/infra/terraform/lxc"

class TerraformService:

    @staticmethod
    def create_lxc(vmid, project_id):
        cmd = [
            "terraform", "-chdir=" + TF_LXC_PATH,
            "apply",
            "-auto-approve",
            f"-var=vmid={vmid}",
            f"-var=project_id={project_id}"
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception("Error Terraform LXC: " + result.stderr)

        return True
