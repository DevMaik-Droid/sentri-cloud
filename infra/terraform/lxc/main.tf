provider "proxmox" {
  pm_api_url = var.proxmox_url
  pm_api_token_id = var.token_id
  pm_api_token_secret = var.token_secret
  pm_tls_insecure = true
}

resource "proxmox_lxc" "user_container" {
  target_node = var.node
  vmid = var.vmid
  hostname = "lxc-${var.vmid}"

  ostemplate = var.template
  cores = var.cores
  memory = var.memory

  rootfs {
    storage = "local-lvm"
    size = var.disk
  }

  unprivileged = false
  onboot = true

  password = var.lxc_password

  features {
    nesting = true
    fuse = true
  }

  network {
    name = "eth0"
    bridge = "vmbr0"
    ip = "dhcp"
  }
}
