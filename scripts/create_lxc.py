import subprocess

def create_lxc(vmid):
    subprocess.run([
        "terraform", "-chdir=/opt/sentri-core/infra/terraform/lxc",
        "apply", "-auto-approve",
        f"-var=vmid={vmid}"
    ])
