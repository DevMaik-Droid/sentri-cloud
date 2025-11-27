import requests

class ProxmoxAPI:
    def __init__(self):
        self.base_url = "https://IP_PROXMOX:8006/api2/json"
        self.headers = {
            "Authorization": "PVEAPIToken=sentri@pve!token=TOKEN_AQUI"
        }

    def get(self, endpoint):
        resp = requests.get(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            verify=False
        )
        resp.raise_for_status()
        return resp.json()

    def post(self, endpoint, data=None):
        resp = requests.post(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            data=data,
            verify=False
        )
        resp.raise_for_status()
        return resp.json()

    def get_lxc_ip(self, vmid, node="pve"):
        data = self.get(f"/nodes/{node}/lxc/{vmid}/status/current")
        try:
            ip = data["data"]["ip"]
            return ip
        except:
            return None
