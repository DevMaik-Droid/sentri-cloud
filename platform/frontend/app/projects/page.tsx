"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  ExternalLink,
  Upload,
  FileArchive,
  Loader2,
  Check,
  Copy,
  X,
  Eye,
  Rocket,
  Trash2,
  Terminal,
} from "lucide-react"
import Link from "next/link"

type Project = {
  id: string
  name: string
  runtime: string
  status: "running" | "building" | "stopped" | "error"
  url: string
  createdAt: string
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "api-backend",
    runtime: "Node.js 20",
    status: "running",
    url: "api-backend.sentri.lat",
    createdAt: "hace 2 dias",
  },
  {
    id: "2",
    name: "frontend-app",
    runtime: "Next.js 16",
    status: "running",
    url: "frontend-app.sentri.lat",
    createdAt: "hace 5 dias",
  },
  {
    id: "3",
    name: "admin-panel",
    runtime: "React 19",
    status: "building",
    url: "admin-panel.sentri.lat",
    createdAt: "hace 1 semana",
  },
]

const runtimeOptions = [
  { value: "nodejs20", label: "Node.js 20" },
  { value: "nodejs18", label: "Node.js 18" },
  { value: "nextjs16", label: "Next.js 16" },
  { value: "react19", label: "React 19" },
  { value: "python311", label: "Python 3.11" },
  { value: "go121", label: "Go 1.21" },
  { value: "static", label: "Static" },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // New project state
  const [projectName, setProjectName] = useState("")
  const [runtime, setRuntime] = useState("")
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<{
    url: string
    ssh: { host: string; user: string; password: string }
  } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith(".zip")) {
        setZipFile(file)
        if (!projectName) {
          setProjectName(file.name.replace(".zip", ""))
        }
      }
    },
    [projectName],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith(".zip")) {
      setZipFile(file)
      if (!projectName) {
        setProjectName(file.name.replace(".zip", ""))
      }
    }
  }

  const handleDeploy = async () => {
    if (!zipFile || !projectName || !runtime) return
    setIsDeploying(true)
    setDeployResult(null)

    // Simular deploy
    await new Promise((resolve) => setTimeout(resolve, 3500))

    const newProject: Project = {
      id: String(Date.now()),
      name: projectName.toLowerCase().replace(/\s+/g, "-"),
      runtime: runtimeOptions.find((r) => r.value === runtime)?.label || runtime,
      status: "running",
      url: `${projectName.toLowerCase().replace(/\s+/g, "-")}.sentri.lat`,
      createdAt: "ahora",
    }

    setProjects([newProject, ...projects])
    setDeployResult({
      url: `https://${newProject.url}`,
      ssh: {
        host: `ssh.${newProject.url}`,
        user: "deploy",
        password: "sk_live_" + Math.random().toString(36).substring(2, 15),
      },
    })
    setIsDeploying(false)
  }

  const handleCloseNewModal = () => {
    setShowNewModal(false)
    setProjectName("")
    setRuntime("")
    setZipFile(null)
    setDeployResult(null)
    setIsDeploying(false)
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setShowDetailModal(true)
    setDeployResult(null)
  }

  const handleRedeploy = async () => {
    if (!selectedProject) return
    setIsDeploying(true)
    setDeployResult(null)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setDeployResult({
      url: `https://${selectedProject.url}`,
      ssh: {
        host: `ssh.${selectedProject.url}`,
        user: "deploy",
        password: "sk_live_" + Math.random().toString(36).substring(2, 15),
      },
    })
    setIsDeploying(false)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    setShowDetailModal(false)
  }

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Proyectos ZIP</h1>
            <p className="text-sm text-muted-foreground mt-1">Proyectos creados mediante subida de archivos ZIP</p>
          </div>
          <Button onClick={() => setShowNewModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        <div className="relative max-w-md">
          <Input
            placeholder="Buscar proyectos..."
            className="bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Runtime</span>
                    <span className="text-foreground font-medium">{project.runtime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">URL</span>
                    <a
                      href={`https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      {project.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creado</span>
                    <span className="text-foreground">{project.createdAt}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => handleViewDetails(project)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileArchive className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Sin proyectos ZIP</h3>
              <p className="text-sm text-muted-foreground mb-4">Sube un archivo ZIP para crear tu primer proyecto</p>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showNewModal} onOpenChange={handleCloseNewModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Proyecto ZIP</DialogTitle>
              <DialogDescription>Sube tu proyecto en formato ZIP y configura su entorno</DialogDescription>
            </DialogHeader>

            {!deployResult ? (
              <div className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                    ${zipFile ? "border-success bg-success/5" : ""}
                  `}
                  onClick={() => document.getElementById("zip-input")?.click()}
                >
                  <input id="zip-input" type="file" accept=".zip" className="hidden" onChange={handleFileSelect} />
                  {zipFile ? (
                    <div className="space-y-2">
                      <FileArchive className="h-10 w-10 mx-auto text-success" />
                      <p className="text-sm font-medium text-foreground">{zipFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(zipFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setZipFile(null)
                        }}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Quitar archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Arrastra tu archivo ZIP aqui</p>
                      <p className="text-xs text-muted-foreground">o haz clic para seleccionar</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-name">Nombre del Proyecto</Label>
                  <Input
                    id="project-name"
                    placeholder="mi-proyecto"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="runtime">Runtime</Label>
                  <Select value={runtime} onValueChange={setRuntime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un runtime" />
                    </SelectTrigger>
                    <SelectContent>
                      {runtimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm font-medium text-success flex items-center gap-2 mb-3">
                    <Check className="h-4 w-4" />
                    Proyecto desplegado exitosamente
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">URL:</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={deployResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {deployResult.url}
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.url, "url")}
                        >
                          {copiedField === "url" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">SSH Host:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.host}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.host, "host")}
                        >
                          {copiedField === "host" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">Usuario:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.user}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.user, "user")}
                        >
                          {copiedField === "user" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.password}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.password, "pass")}
                        >
                          {copiedField === "pass" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {!deployResult ? (
                <>
                  <Button variant="outline" onClick={handleCloseNewModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleDeploy} disabled={!zipFile || !projectName || !runtime || isDeploying}>
                    {isDeploying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Desplegando...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Desplegar
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={handleCloseNewModal}>Cerrar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileArchive className="h-5 w-5" />
                {selectedProject?.name}
              </DialogTitle>
              <DialogDescription>Detalles y acciones del proyecto</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <StatusBadge status={selectedProject?.status || "stopped"} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Runtime</p>
                  <p className="text-sm font-medium text-foreground">{selectedProject?.runtime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Creado</p>
                  <p className="text-sm font-medium text-foreground">{selectedProject?.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL</p>
                  <a
                    href={`https://${selectedProject?.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedProject?.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {deployResult && (
                <div className="space-y-3 p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Redeploy completado exitosamente
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">URL:</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={deployResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {deployResult.url}
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.url, "detail-url")}
                        >
                          {copiedField === "detail-url" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">SSH Host:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.host}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.host, "detail-host")}
                        >
                          {copiedField === "detail-host" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">Usuario:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.user}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.user, "detail-user")}
                        >
                          {copiedField === "detail-user" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-background">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">{deployResult.ssh.password}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(deployResult.ssh.password, "detail-pass")}
                        >
                          {copiedField === "detail-pass" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${selectedProject?.id}`}>
                    <Terminal className="mr-1.5 h-3 w-3" />
                    Ver Logs
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive bg-transparent"
                  onClick={() => selectedProject && handleDeleteProject(selectedProject.id)}
                >
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Eliminar
                </Button>
              </div>
              <Button onClick={handleRedeploy} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desplegando...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Redeploy
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
