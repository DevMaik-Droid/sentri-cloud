"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Github,
  ExternalLink,
  Rocket,
  Eye,
  RefreshCw,
  Clock,
  GitBranch,
  Copy,
  Check,
  Loader2,
  Trash2,
  Plus,
  Star,
  GitFork,
  Search,
} from "lucide-react"

type GitHubProject = {
  id: string
  name: string
  repo: string
  branch: string
  status: "running" | "building" | "stopped" | "error"
  url: string
  lastDeploy: string
  autoDeployEnabled: boolean
  language: string
}

type GitHubRepo = {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  branches: string[]
  updated: string
}

const initialProjects: GitHubProject[] = [
  {
    id: "1",
    name: "my-nextjs-app",
    repo: "johndoe/my-nextjs-app",
    branch: "main",
    status: "running",
    url: "nextjs.sentri.lat",
    lastDeploy: "hace 2 horas",
    autoDeployEnabled: true,
    language: "TypeScript",
  },
  {
    id: "2",
    name: "api-gateway",
    repo: "johndoe/api-gateway",
    branch: "main",
    status: "running",
    url: "api-gateway.sentri.lat",
    lastDeploy: "hace 1 dia",
    autoDeployEnabled: true,
    language: "JavaScript",
  },
]

const availableRepos: GitHubRepo[] = [
  {
    id: "r1",
    name: "react-dashboard",
    fullName: "johndoe/react-dashboard",
    description: "Admin dashboard built with React and Tailwind",
    language: "TypeScript",
    stars: 89,
    forks: 34,
    branches: ["main", "develop", "feature/charts"],
    updated: "hace 3 dias",
  },
  {
    id: "r2",
    name: "express-api",
    fullName: "johndoe/express-api",
    description: "RESTful API with Express and MongoDB",
    language: "JavaScript",
    stars: 56,
    forks: 18,
    branches: ["main", "staging"],
    updated: "hace 1 semana",
  },
  {
    id: "r3",
    name: "flask-ml-api",
    fullName: "johndoe/flask-ml-api",
    description: "Machine learning API with Flask",
    language: "Python",
    stars: 123,
    forks: 45,
    branches: ["main", "develop", "v2"],
    updated: "hace 2 semanas",
  },
  {
    id: "r4",
    name: "go-websocket",
    fullName: "johndoe/go-websocket",
    description: "Real-time websocket server in Go",
    language: "Go",
    stars: 234,
    forks: 67,
    branches: ["main"],
    updated: "hace 1 mes",
  },
  {
    id: "r5",
    name: "vue-ecommerce",
    fullName: "johndoe/vue-ecommerce",
    description: "E-commerce frontend with Vue 3",
    language: "Vue",
    stars: 178,
    forks: 56,
    branches: ["main", "develop"],
    updated: "hace 5 dias",
  },
]

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Go: "bg-cyan-500",
  Vue: "bg-emerald-500",
}

export default function GitHubProjectsPage() {
  const [projects, setProjects] = useState<GitHubProject[]>(initialProjects)
  const [selectedProject, setSelectedProject] = useState<GitHubProject | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<{
    url: string
    ssh: { host: string; user: string; password: string }
  } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [repoSearchQuery, setRepoSearchQuery] = useState("")

  // Import state
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(true)
  const [isImporting, setIsImporting] = useState(false)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleViewDetails = (project: GitHubProject) => {
    setSelectedProject(project)
    setShowDetailModal(true)
    setDeployResult(null)
  }

  const handleDeploy = async () => {
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

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo)
    setSelectedBranch(repo.branches[0])
  }

  const handleImportRepo = async () => {
    if (!selectedRepo || !selectedBranch) return
    setIsImporting(true)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const newProject: GitHubProject = {
      id: String(Date.now()),
      name: selectedRepo.name,
      repo: selectedRepo.fullName,
      branch: selectedBranch,
      status: "building",
      url: `${selectedRepo.name}.sentri.lat`,
      lastDeploy: "ahora",
      autoDeployEnabled,
      language: selectedRepo.language,
    }

    setProjects([newProject, ...projects])
    setIsImporting(false)
    setShowImportModal(false)
    setSelectedRepo(null)
    setSelectedBranch("")

    // Simulate build completing
    setTimeout(() => {
      setProjects((prev) => prev.map((p) => (p.id === newProject.id ? { ...p, status: "running" as const } : p)))
    }, 3000)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    setShowDetailModal(false)
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.repo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredRepos = availableRepos.filter(
    (repo) =>
      !projects.some((p) => p.repo === repo.fullName) &&
      (repo.name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(repoSearchQuery.toLowerCase())),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">GitHub Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Proyectos desplegados desde GitHub</p>
          </div>
          <Button onClick={() => setShowImportModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Importar Repositorio
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <a
                      href={`https://github.com/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />
                      {project.repo}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(project)}>
                      <Eye className="mr-1.5 h-3 w-3" />
                      Detalles
                    </Button>
                    <Button size="sm" onClick={() => handleViewDetails(project)}>
                      <Rocket className="mr-1.5 h-3 w-3" />
                      Deploy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-500"}`} />
                    {project.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    {project.branch}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {project.lastDeploy}
                  </div>
                  <a
                    href={`https://${project.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {project.url}
                  </a>
                  {project.autoDeployEnabled && (
                    <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded">Auto-deploy</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Github className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Sin proyectos de GitHub</h3>
              <p className="text-sm text-muted-foreground mb-4">Importa un repositorio para comenzar</p>
              <Button onClick={() => setShowImportModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Importar Repositorio
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Importar Repositorio</DialogTitle>
              <DialogDescription>Selecciona un repositorio de tu cuenta de GitHub</DialogDescription>
            </DialogHeader>

            {!selectedRepo ? (
              <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar repositorios..."
                    className="pl-10"
                    value={repoSearchQuery}
                    onChange={(e) => setRepoSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo)}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-foreground">{repo.name}</h4>
                          <p className="text-sm text-muted-foreground">{repo.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-3 w-3 rounded-full ${languageColors[repo.language] || "bg-gray-500"}`} />
                          {repo.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stars}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {repo.forks}
                        </div>
                        <span className="text-xs">{repo.updated}</span>
                      </div>
                    </div>
                  ))}

                  {filteredRepos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Github className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron repositorios</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-primary/50 bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{selectedRepo.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedRepo.fullName}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRepo(null)}>
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRepo.branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Auto-deploy</p>
                    <p className="text-sm text-muted-foreground">Desplegar automaticamente al hacer push</p>
                  </div>
                  <Switch checked={autoDeployEnabled} onCheckedChange={setAutoDeployEnabled} />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                Cancelar
              </Button>
              {selectedRepo && (
                <Button onClick={handleImportRepo} disabled={!selectedBranch || isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Github className="mr-2 h-4 w-4" />
                      Importar y Desplegar
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                {selectedProject?.name}
              </DialogTitle>
              <DialogDescription>
                <a
                  href={`https://github.com/${selectedProject?.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {selectedProject?.repo}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <StatusBadge status={selectedProject?.status || "stopped"} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    {selectedProject?.branch}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lenguaje</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <div
                      className={`h-3 w-3 rounded-full ${languageColors[selectedProject?.language || ""] || "bg-gray-500"}`}
                    />
                    {selectedProject?.language}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ultimo Deploy</p>
                  <p className="text-sm font-medium text-foreground">{selectedProject?.lastDeploy}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">URL Publica</p>
                <a
                  href={`https://${selectedProject?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  https://{selectedProject?.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {deployResult && (
                <div className="space-y-3 p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Deploy completado exitosamente
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
                          onClick={() => copyToClipboard(deployResult.url, "deploy-url")}
                        >
                          {copiedField === "deploy-url" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
                          onClick={() => copyToClipboard(deployResult.ssh.host, "ssh-host")}
                        >
                          {copiedField === "ssh-host" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
                          onClick={() => copyToClipboard(deployResult.ssh.user, "ssh-user")}
                        >
                          {copiedField === "ssh-user" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
                          onClick={() => copyToClipboard(deployResult.ssh.password, "ssh-pass")}
                        >
                          {copiedField === "ssh-pass" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
                  <a href={`https://github.com/${selectedProject?.repo}`} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-3 w-3" />
                    Ver en GitHub
                  </a>
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
              <Button onClick={handleDeploy} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desplegando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
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
