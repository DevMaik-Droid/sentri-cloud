provider "proxmox" {
  pm_api_url = var.proxmox_url
  pm_api_token_id = var.token_id
  pm_api_token_secret = var.token_secret
  pm_tls_insecure = true
}

resource "proxmox_vm_qemu" "premium_vm" {
  name = "vm-${var.vmid}"
  vmid = var.vmid

  target_node = var.node
  clone = var.template

  cores = var.cores
  memory = var.memory

  disk {
    size = var.disk
    storage = "local-lvm"
    type = "scsi"
  }

  network {
    model = "virtio"
    bridge = "vmbr0"
  }

  ciuser = "ubuntu"
  cipassword = var.vm_password
  sshkeys = var.ssh_public_key
  ipconfig0 = "ip=dhcp"
}
