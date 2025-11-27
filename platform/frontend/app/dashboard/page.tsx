"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  Github,
  Rocket,
  Server,
  Plus,
  ArrowRight,
  Upload,
  FileArchive,
  X,
  Check,
  ExternalLink,
  GitBranch,
  Star,
  Clock,
} from "lucide-react"
import Link from "next/link"
import CopyButton from "@/components/copy-button"
import { deployGithubProject, deployProject, uploadProject } from "@/services/proyecto-service"
import { getReposotories } from "@/services/git-service"
import { GitHubRepo } from "@/types/git-types"


const stats = [
  { name: "Mis Proyectos", value: "12", icon: FolderKanban, href: "/projects" },
  { name: "GitHub Projects", value: "8", icon: Github, href: "/github/repos" },
  { name: "Deployments", value: "24", icon: Rocket, href: "/deployments" },
  { name: "VPS / Servidores", value: "3", icon: Server, href: "/vps" },
]

const recentDeployments = [
  { name: "api-backend", status: "ready", time: "hace 2 min" },
  { name: "frontend-app", status: "building", time: "hace 5 min" },
  { name: "admin-panel", status: "ready", time: "hace 1 hora" },
]

interface DeploymentResult {
  url: string
  sshHost: string
  sshUser: string
  sshPassword: string
  dbHost?: string
  dbUser?: string
  dbPassword?: string
}

export default function DashboardPage() {

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)

  const [selectedRepo, setSelectedRepo] = useState<(typeof githubRepos)[0] | null>(null)
  const [repoModalOpen, setRepoModalOpen] = useState(false)
  const [isDeployingRepo, setIsDeployingRepo] = useState(false)
  const [repoDeploymentResult, setRepoDeploymentResult] = useState<DeploymentResult | null>(null)

  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])

  useEffect(() => {
    const handleObtenerRepos = async () => {
      const response = await getReposotories()

      const repos = response.map((repo: GitHubRepo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        branch: repo.branch,
        owner: repo.owner,
        updatedAt: repo.updatedAt,
      }))
      setGithubRepos(repos)
    }

    handleObtenerRepos()
  }, [])



  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".zip")) {
        setUploadedFile(file)
        setDeploymentResult(null)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setDeploymentResult(null)
    }
  }

  const handleDeployZip = async () => {
    if (!uploadedFile) return

    setIsDeploying(true)

    try {
      // 1. Subir ZIP al backend
      const formData = new FormData()
      formData.append("archivo", uploadedFile)
      formData.append("nombre", uploadedFile.name.replace(".zip", ""))

      const uploadResponse = await uploadProject(formData);

      const projectId = uploadResponse.id

      // 2. Llamar al deploy real
      const deployResponse = await deployProject(projectId);

      const result = deployResponse



      setDeploymentResult({
        url: result.data.dominio,
        sshHost: result.ssh_host || null,
        sshUser: result.ssh_user || null,
        sshPassword: result.ssh_password || null,
        dbHost: result.db_host || null,
        dbUser: result.db_user || null,
        dbPassword: result.db_password || null,
      })
    } catch (error) {
      console.error(error)
      alert("Error desplegando el proyecto")
    }

    setIsDeploying(false)
  }

  const handleSelectRepo = (repo: (typeof githubRepos)[0]) => {
    setSelectedRepo(repo)
    setRepoModalOpen(true)
    setRepoDeploymentResult(null)
  }


  // deplegar repositorio
  const handleDeployRepo = async () => {
    if (!selectedRepo) return

    setIsDeployingRepo(true)

    try {

      const uploadResponse = await deployGithubProject(selectedRepo);

      const proyect_id = uploadResponse.id


      const deployResponse = await deployProject(proyect_id);

      const result = deployResponse

      setRepoDeploymentResult({
        url: result.data.dominio,
        sshHost: result.ssh_host || null,
        sshUser: result.ssh_user || null,
        sshPassword: result.ssh_password || null,
        dbHost: result.db_host || null,
        dbUser: result.db_user || null,
        dbPassword: result.db_password || null,
      })

    } catch (error) {
      console.error(error)
      alert("Error desplegando el proyecto")
    }

    setIsDeployingRepo(false)
  }


  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Bienvenido a Sentri Cloud. Gestiona tus proyectos y deployments.
            </p>
          </div>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <Link href={stat.href} className="text-xs text-primary hover:underline inline-flex items-center mt-2">
                  Ver todos
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Deploy rápido con ZIP
            </CardTitle>
            <CardDescription>Arrastra tu archivo ZIP o selecciónalo para desplegar tu proyecto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Dropzone */}
              <div
                className={`flex-1 relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragActive
                  ? "border-primary bg-primary/5"
                  : uploadedFile
                    ? "border-success bg-success/5"
                    : "border-border hover:border-muted-foreground/50"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploadedFile ? (
                  <div className="space-y-3">
                    <FileArchive className="mx-auto h-12 w-12 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                        setDeploymentResult(null)
                      }}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Quitar archivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className={`mx-auto h-12 w-12 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {dragActive ? "Suelta tu archivo aquí" : "Arrastra tu archivo ZIP aquí"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">o haz clic para seleccionar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deploy button and result */}
              <div className="flex-1 flex flex-col justify-center">
                {!deploymentResult ? (
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!uploadedFile || isDeploying}
                      onClick={handleDeployZip}
                    >
                      {isDeploying ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Desplegando...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Deploy
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Soporta proyectos Node.js, Python, Go y más
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-lg bg-success/10 border border-success/30">
                    <div className="flex items-center gap-2 text-success">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Deployment exitoso</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-2 p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">URL:</span>
                        <div className="flex items-center gap-1">
                          <a
                            href={deploymentResult.url}
                            target="_blank"
                            className="text-primary hover:underline font-mono text-xs"
                            rel="noreferrer"
                          >
                            {deploymentResult.url}
                          </a>
                          <CopyButton value={deploymentResult.url} field="zip-url" />
                          <a href={deploymentResult.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">SSH:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono text-xs">
                            {deploymentResult.sshUser}@{deploymentResult.sshHost}
                          </code>
                          <CopyButton
                            value={`${deploymentResult.sshUser}@${deploymentResult.sshHost}`}
                            field="zip-ssh"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">Password:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono text-xs">{deploymentResult.sshPassword}</code>
                          <CopyButton value={deploymentResult.sshPassword} field="zip-pass" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Deployments Recientes</CardTitle>
              <CardDescription>Tus últimos deployments activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeployments.map((deploy) => (
                  <div
                    key={deploy.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${deploy.status === "ready"
                          ? "bg-success"
                          : deploy.status === "building"
                            ? "bg-warning animate-pulse"
                            : "bg-destructive"
                          }`}
                      />
                      <span className="text-sm font-medium text-foreground">{deploy.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{deploy.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/deployments">Ver todos los deployments</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Repositories
              </CardTitle>
              <CardDescription>Selecciona un repositorio para desplegar</CardDescription>
            </CardHeader>
            <CardContent>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {githubRepos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo)}
                    className="w-full text-left rounded-lg border border-border p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate"> <span className="text-muted-foreground text-[10px] ">{repo.owner}</span>/{repo.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{repo.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {repo.language}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {repo.branch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {repo.updatedAt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>


              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/github/repos">
                  Ver todos los repositorios
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={repoModalOpen} onOpenChange={setRepoModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {selectedRepo?.name}
            </DialogTitle>
            <DialogDescription>{selectedRepo?.fullName}</DialogDescription>
          </DialogHeader>

          {selectedRepo && (
            <div className="space-y-4">
              {!repoDeploymentResult ? (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">{selectedRepo.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Lenguaje:</span>
                        <Badge variant="secondary">{selectedRepo.language}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Branch:</span>
                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{selectedRepo.branch}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-muted-foreground" />
                        <span>{selectedRepo.stars} stars</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{selectedRepo.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setRepoModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1" disabled={isDeployingRepo} onClick={handleDeployRepo}>
                      {isDeployingRepo ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Desplegando...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Deploy
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-success p-3 rounded-lg bg-success/10 border border-success/30">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Deployment exitoso</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border">
                      <span className="text-sm text-muted-foreground">URL pública:</span>
                      <div className="flex items-center gap-1">
                        <a
                          href={repoDeploymentResult.url}
                          target="_blank"
                          className="text-primary hover:underline font-mono text-sm"
                          rel="noreferrer"
                        >
                          {repoDeploymentResult.url}
                        </a>
                        <CopyButton value={repoDeploymentResult.url} field="repo-url" />
                        <a href={repoDeploymentResult.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border space-y-2">
                      <p className="text-sm font-medium text-foreground">Credenciales SSH</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Host:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono text-xs">{repoDeploymentResult.sshHost}</code>
                          <CopyButton value={repoDeploymentResult.sshHost} field="repo-host" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Usuario:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono text-xs">{repoDeploymentResult.sshUser}</code>
                          <CopyButton value={repoDeploymentResult.sshUser} field="repo-user" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Password:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono text-xs">{repoDeploymentResult.sshPassword}</code>
                          <CopyButton value={repoDeploymentResult.sshPassword} field="repo-pass" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setRepoModalOpen(false)
                      setRepoDeploymentResult(null)
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
