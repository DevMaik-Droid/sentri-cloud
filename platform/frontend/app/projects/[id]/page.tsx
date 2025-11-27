"use client"

import { useState, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  ArrowLeft,
  ExternalLink,
  Rocket,
  FileText,
  Github,
  Clock,
  GitBranch,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params)
  const [isDeploying, setIsDeploying] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [showBuildsModal, setShowBuildsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Mock data - en producción vendría de API
  const project = {
    id,
    name: "api-backend",
    runtime: "Node.js 20",
    status: "running" as const,
    url: "api.sentri.lat",
    lastBuild: "hace 2 horas",
    lastCommit: "feat: add new endpoints",
    buildTime: "45s",
    sshHost: "ssh.api.sentri.lat",
    sshUser: "deploy",
    sshPassword: "sk_live_abc123xyz",
  }

  const builds = [
    {
      id: "1",
      status: "running" as const,
      branch: "main",
      commit: "feat: add new endpoints",
      time: "hace 2 horas",
      duration: "45s",
    },
    {
      id: "2",
      status: "running" as const,
      branch: "main",
      commit: "fix: cors issue",
      time: "hace 1 día",
      duration: "38s",
    },
    {
      id: "3",
      status: "error" as const,
      branch: "develop",
      commit: "test: add unit tests",
      time: "hace 2 días",
      duration: "12s",
    },
    {
      id: "4",
      status: "running" as const,
      branch: "main",
      commit: "chore: update deps",
      time: "hace 3 días",
      duration: "52s",
    },
  ]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsDeploying(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <a
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
            >
              {project.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Runtime</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{project.runtime}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Último Build</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">{project.lastBuild}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Build Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{project.buildTime}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={project.status} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDeploy} disabled={isDeploying}>
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Desplegando...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Deploy Ahora
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setShowBuildsModal(true)}>
            <GitBranch className="mr-2 h-4 w-4" />
            Ver Builds
          </Button>
          <Button variant="outline" onClick={() => setShowLogsModal(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Ver Logs
          </Button>
          <Button variant="outline" asChild>
            <Link href="/github/repos">
              <Github className="mr-2 h-4 w-4" />
              Conectar GitHub
            </Link>
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive bg-transparent"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Acceso SSH</CardTitle>
            <CardDescription>Credenciales para acceder al servidor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Host</p>
                <p className="text-sm font-mono text-foreground">{project.sshHost}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(project.sshHost, "host")}>
                {copiedField === "host" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Usuario</p>
                <p className="text-sm font-mono text-foreground">{project.sshUser}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(project.sshUser, "user")}>
                {copiedField === "user" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Password</p>
                <p className="text-sm font-mono text-foreground">{project.sshPassword}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(project.sshPassword, "password")}>
                {copiedField === "password" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Logs del Deploy</CardTitle>
            <CardDescription>Salida del último proceso de build y deploy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background rounded-lg p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
              <div className="space-y-1">
                <p>
                  <span className="text-success">✓</span> Cloning repository...
                </p>
                <p>
                  <span className="text-success">✓</span> Installing dependencies...
                </p>
                <p>
                  <span className="text-success">✓</span> Running build command: npm run build
                </p>
                <p>
                  <span className="text-success">✓</span> Build completed in 45s
                </p>
                <p>
                  <span className="text-success">✓</span> Deploying to production...
                </p>
                <p>
                  <span className="text-success">✓</span> Deploy successful!
                </p>
                <p className="text-primary">→ Available at https://{project.url}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Logs Completos - {project.name}</DialogTitle>
              <DialogDescription>Toda la salida del proceso de build y deploy</DialogDescription>
            </DialogHeader>
            <div className="bg-background rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px]">
              <div className="space-y-1 text-muted-foreground">
                <p>[2024-01-15 10:30:00] Starting deployment...</p>
                <p>
                  <span className="text-success">✓</span> Cloning repository...
                </p>
                <p>[2024-01-15 10:30:05] Repository cloned successfully</p>
                <p>
                  <span className="text-success">✓</span> Installing dependencies...
                </p>
                <p className="text-foreground"> npm install</p>
                <p className="text-foreground"> added 1247 packages in 32s</p>
                <p>
                  <span className="text-success">✓</span> Running build command: npm run build
                </p>
                <p className="text-foreground"> Creating optimized production build...</p>
                <p className="text-foreground"> Compiled successfully!</p>
                <p>
                  <span className="text-success">✓</span> Build completed in 45s
                </p>
                <p>
                  <span className="text-success">✓</span> Deploying to production...
                </p>
                <p>[2024-01-15 10:31:20] Deployment completed</p>
                <p>
                  <span className="text-success">✓</span> Deploy successful!
                </p>
                <p className="text-primary">→ Available at https://{project.url}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogsModal(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showBuildsModal} onOpenChange={setShowBuildsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Historial de Builds - {project.name}</DialogTitle>
              <DialogDescription>Todos los builds anteriores de este proyecto</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {builds.map((build) => (
                <div key={build.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <StatusBadge status={build.status} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{build.commit}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <GitBranch className="h-3 w-3" />
                        {build.branch}
                        <span>•</span>
                        {build.time}
                        <span>•</span>
                        {build.duration}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBuildsModal(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Eliminar Proyecto</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar {project.name}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" asChild>
                <Link href="/projects">Eliminar Proyecto</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
