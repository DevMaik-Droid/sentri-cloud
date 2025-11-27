"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Cpu,
  MemoryStick,
  HardDrive,
  RotateCw,
  Square,
  Terminal,
  Play,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Settings,
  FolderKanban,
  Loader2,
  Save,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

const initialProjectVPS = [
  {
    id: "1",
    name: "api-backend-vps",
    project: "api-backend",
    cpu: "4 vCPU",
    ram: "8 GB",
    storage: "100 GB SSD",
    status: "running" as const,
    ip: "192.168.1.100",
    url: "api.sentri.lat",
  },
  {
    id: "2",
    name: "frontend-app-vps",
    project: "frontend-app",
    cpu: "2 vCPU",
    ram: "4 GB",
    storage: "50 GB SSD",
    status: "running" as const,
    ip: "192.168.1.101",
    url: "app.sentri.lat",
  },
]

const initialStandaloneVPS = [
  {
    id: "3",
    name: "database-server",
    cpu: "8 vCPU",
    ram: "16 GB",
    storage: "500 GB SSD",
    status: "running" as "running" | "stopped" | "building",
    ip: "192.168.1.200",
    os: "Ubuntu 22.04 LTS",
  },
  {
    id: "4",
    name: "redis-cache",
    cpu: "2 vCPU",
    ram: "4 GB",
    storage: "50 GB SSD",
    status: "running" as "running" | "stopped" | "building",
    ip: "192.168.1.201",
    os: "Debian 12",
  },
  {
    id: "5",
    name: "dev-sandbox",
    cpu: "2 vCPU",
    ram: "2 GB",
    storage: "25 GB SSD",
    status: "stopped" as "running" | "stopped" | "building",
    ip: "192.168.1.202",
    os: "Ubuntu 22.04 LTS",
  },
]

export default function VPSPage() {
  const [projectVPS, setProjectVPS] = useState(initialProjectVPS)
  const [standaloneVPS, setStandaloneVPS] = useState(initialStandaloneVPS)
  const [selectedVPS, setSelectedVPS] = useState<(typeof projectVPS)[0] | (typeof standaloneVPS)[0] | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editVPS, setEditVPS] = useState<(typeof standaloneVPS)[0] | null>(null)
  const [editName, setEditName] = useState("")
  const [editCpu, setEditCpu] = useState("")
  const [editRam, setEditRam] = useState("")
  const [saving, setSaving] = useState(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteVPS, setDeleteVPS] = useState<(typeof standaloneVPS)[0] | null>(null)
  const [deleting, setDeleting] = useState(false)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleAction = async (action: string, vpsId: string, type: "project" | "standalone") => {
    setActionLoading(`${action}-${vpsId}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (action === "stop" || action === "start") {
      if (type === "project") {
        setProjectVPS(
          (prev) =>
            prev.map((vps) =>
              vps.id === vpsId ? { ...vps, status: vps.status === "running" ? "stopped" : "running" } : vps,
            ) as typeof projectVPS,
        )
      } else {
        setStandaloneVPS((prev) =>
          prev.map((vps) =>
            vps.id === vpsId ? { ...vps, status: vps.status === "running" ? "stopped" : "running" } : vps,
          ),
        )
      }
    }

    setActionLoading(null)
  }

  const openConsole = (vps: (typeof projectVPS)[0] | (typeof standaloneVPS)[0]) => {
    setSelectedVPS(vps)
    setShowConsole(true)
    setConsoleOutput([`Connecting to ${vps.name} (${vps.ip})...`, "Connection established.", `root@${vps.name}:~# `])
  }

  const openEditModal = (vps: (typeof standaloneVPS)[0]) => {
    setEditVPS(vps)
    setEditName(vps.name)
    setEditCpu(vps.cpu)
    setEditRam(vps.ram)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editVPS) return
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStandaloneVPS((prev) =>
      prev.map((vps) => (vps.id === editVPS.id ? { ...vps, name: editName, cpu: editCpu, ram: editRam } : vps)),
    )

    setSaving(false)
    setShowEditModal(false)
  }

  const openDeleteDialog = (vps: (typeof standaloneVPS)[0]) => {
    setDeleteVPS(vps)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteVPS) return
    setDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStandaloneVPS((prev) => prev.filter((vps) => vps.id !== deleteVPS.id))

    setDeleting(false)
    setShowDeleteDialog(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">VPS / Servidores</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona tus servidores virtuales privados</p>
          </div>
          <Button asChild>
            <Link href="/vps/new">
              <Plus className="mr-2 h-4 w-4" />
              Crear nuevo VPS
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">VPS de Proyectos</span>
              <span className="sm:hidden">Proyectos</span>
            </TabsTrigger>
            <TabsTrigger value="standalone" className="gap-2">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">VPS Independientes</span>
              <span className="sm:hidden">Independientes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projectVPS.map((server) => (
                <Card key={server.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{server.name}</h3>
                      <StatusBadge status={server.status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">{server.ip}</p>
                      <Link
                        href={`/projects/${server.id}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <FolderKanban className="h-3 w-3" />
                        {server.project}
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.cpu}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.ram}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.storage}</span>
                      </div>
                    </div>

                    <a
                      href={`https://${server.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {server.url}
                    </a>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleAction("restart", server.id, "project")}
                        disabled={actionLoading === `restart-${server.id}`}
                      >
                        <RotateCw
                          className={`mr-1.5 h-3 w-3 ${actionLoading === `restart-${server.id}` ? "animate-spin" : ""}`}
                        />
                        <span className="hidden sm:inline">Reiniciar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() =>
                          handleAction(server.status === "running" ? "stop" : "start", server.id, "project")
                        }
                        disabled={actionLoading === `stop-${server.id}` || actionLoading === `start-${server.id}`}
                      >
                        {server.status === "running" ? (
                          <>
                            <Square className="mr-1.5 h-3 w-3" />
                            <span className="hidden sm:inline">Detener</span>
                          </>
                        ) : (
                          <>
                            <Play className="mr-1.5 h-3 w-3" />
                            <span className="hidden sm:inline">Iniciar</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <Button variant="secondary" className="w-full" onClick={() => openConsole(server)}>
                      <Terminal className="mr-2 h-4 w-4" />
                      Consola SSH
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {projectVPS.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Sin VPS de proyectos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Despliega un proyecto para crear un VPS vinculado
                  </p>
                  <Button asChild>
                    <Link href="/projects/new">Crear Proyecto</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="standalone" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {standaloneVPS.map((server) => (
                <Card key={server.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{server.name}</h3>
                      <StatusBadge status={server.status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">{server.ip}</p>
                      <p className="text-xs text-muted-foreground">{server.os}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.cpu}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.ram}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium text-xs">{server.storage}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleAction("restart", server.id, "standalone")}
                        disabled={actionLoading === `restart-${server.id}`}
                      >
                        <RotateCw
                          className={`mr-1.5 h-3 w-3 ${actionLoading === `restart-${server.id}` ? "animate-spin" : ""}`}
                        />
                        <span className="hidden sm:inline">Reiniciar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() =>
                          handleAction(server.status === "running" ? "stop" : "start", server.id, "standalone")
                        }
                        disabled={actionLoading === `stop-${server.id}` || actionLoading === `start-${server.id}`}
                      >
                        {server.status === "running" ? (
                          <>
                            <Square className="mr-1.5 h-3 w-3" />
                            <span className="hidden sm:inline">Detener</span>
                          </>
                        ) : (
                          <>
                            <Play className="mr-1.5 h-3 w-3" />
                            <span className="hidden sm:inline">Iniciar</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1" onClick={() => openConsole(server)}>
                        <Terminal className="mr-2 h-4 w-4" />
                        SSH
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                        onClick={() => openEditModal(server)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(server)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {standaloneVPS.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Cpu className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Sin VPS independientes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Crea un VPS para comenzar</p>
                  <Button asChild>
                    <Link href="/vps/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear VPS
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal de consola SSH */}
        <Dialog open={showConsole} onOpenChange={setShowConsole}>
          <DialogContent className="max-w-4xl h-[500px] sm:h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Consola SSH - {selectedVPS?.name}
              </DialogTitle>
              <DialogDescription>Conectado a {selectedVPS?.ip}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 bg-background rounded-lg p-4 font-mono text-sm overflow-auto">
              {consoleOutput.map((line, index) => (
                <div key={index} className="text-green-400">
                  {line}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-green-400">root@{selectedVPS?.name}:~# </span>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = e.currentTarget.value
                      setConsoleOutput((prev) => [
                        ...prev,
                        `root@${selectedVPS?.name}:~# ${value}`,
                        `Command: ${value} executed`,
                      ])
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>IP: {selectedVPS?.ip}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedVPS?.ip || "", "ip")}>
                  {copiedField === "ip" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowConsole(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Editar VPS
              </DialogTitle>
              <DialogDescription>Modifica la configuración del servidor {editVPS?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del VPS</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cpu">CPU</Label>
                <Select value={editCpu} onValueChange={setEditCpu}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 vCPU">1 vCPU</SelectItem>
                    <SelectItem value="2 vCPU">2 vCPU</SelectItem>
                    <SelectItem value="4 vCPU">4 vCPU</SelectItem>
                    <SelectItem value="8 vCPU">8 vCPU</SelectItem>
                    <SelectItem value="16 vCPU">16 vCPU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ram">Memoria RAM</Label>
                <Select value={editRam} onValueChange={setEditRam}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 GB">1 GB</SelectItem>
                    <SelectItem value="2 GB">2 GB</SelectItem>
                    <SelectItem value="4 GB">4 GB</SelectItem>
                    <SelectItem value="8 GB">8 GB</SelectItem>
                    <SelectItem value="16 GB">16 GB</SelectItem>
                    <SelectItem value="32 GB">32 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  <strong>Nota:</strong> Los cambios de recursos pueden requerir reinicio del servidor.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Eliminar VPS
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar el VPS <strong>{deleteVPS?.name}</strong>? Esta acción no se puede
                deshacer y todos los datos serán eliminados permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar VPS
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
