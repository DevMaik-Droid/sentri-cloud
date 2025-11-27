"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { ExternalLink, MoreVertical, Clock, GitBranch, Loader2, RefreshCw, Trash2, FileText, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const initialDeployments = [
  {
    id: "1",
    project: "api-backend",
    url: "api.sentri.lat",
    status: "running" as const,
    branch: "main",
    commit: "feat: add auth endpoints",
    time: "hace 2 min",
  },
  {
    id: "2",
    project: "frontend-app",
    url: "app.sentri.lat",
    status: "building" as const,
    branch: "develop",
    commit: "fix: responsive layout",
    time: "hace 5 min",
  },
  {
    id: "3",
    project: "admin-panel",
    url: "admin.sentri.lat",
    status: "running" as const,
    branch: "main",
    commit: "chore: update deps",
    time: "hace 1 hora",
  },
  {
    id: "4",
    project: "microservice-auth",
    url: "auth.sentri.lat",
    status: "error" as const,
    branch: "main",
    commit: "feat: jwt validation",
    time: "hace 2 horas",
  },
  {
    id: "5",
    project: "landing-page",
    url: "landing.sentri.lat",
    status: "running" as const,
    branch: "main",
    commit: "update hero section",
    time: "hace 3 horas",
  },
]

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState(initialDeployments)
  const [selectedDeployment, setSelectedDeployment] = useState<(typeof initialDeployments)[0] | null>(null)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [redeployingId, setRedeployingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleRedeploy = async (id: string) => {
    setRedeployingId(id)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setDeployments((prev) => prev.map((d) => (d.id === id ? { ...d, status: "running" as const, time: "ahora" } : d)))
    setRedeployingId(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeployments((prev) => prev.filter((d) => d.id !== id))
    setDeletingId(null)
  }

  const handleViewLogs = (deployment: (typeof initialDeployments)[0]) => {
    setSelectedDeployment(deployment)
    setShowLogsModal(true)
  }

  const handleViewDetails = (deployment: (typeof initialDeployments)[0]) => {
    setSelectedDeployment(deployment)
    setShowDetailsModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Deployments</h1>
          <p className="text-sm text-muted-foreground mt-1">Lista de todos los deployments activos de tus proyectos</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-3">Proyecto</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Branch</div>
              <div className="col-span-3">Commit</div>
              <div className="col-span-1">Tiempo</div>
              <div className="col-span-1"></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {deployments.map((deployment, index) => (
              <div
                key={deployment.id}
                className={`grid grid-cols-12 gap-4 items-center p-4 ${
                  index !== deployments.length - 1 ? "border-b border-border" : ""
                } hover:bg-accent/50 transition-colors`}
              >
                <div className="col-span-3">
                  <Link href={`/projects/${deployment.id}`} className="font-medium text-foreground hover:text-primary">
                    {deployment.project}
                  </Link>
                  <a
                    href={`https://${deployment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {deployment.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="col-span-2">
                  <StatusBadge status={deployment.status} />
                </div>
                <div className="col-span-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  {deployment.branch}
                </div>
                <div className="col-span-3 text-sm text-muted-foreground truncate">{deployment.commit}</div>
                <div className="col-span-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {deployment.time}
                </div>
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(deployment)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewLogs(deployment)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Ver logs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRedeploy(deployment.id)}
                        disabled={redeployingId === deployment.id}
                      >
                        {redeployingId === deployment.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Redeploy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(deployment.id)}
                        disabled={deletingId === deployment.id}
                      >
                        {deletingId === deployment.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Logs - {selectedDeployment?.project}</DialogTitle>
              <DialogDescription>Salida del proceso de build y deploy</DialogDescription>
            </DialogHeader>
            <div className="bg-background rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px]">
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="text-success">✓</span> Cloning repository...
                </p>
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
                <p>
                  <span className="text-success">✓</span> Deploy successful!
                </p>
                <p className="text-primary">→ Available at https://{selectedDeployment?.url}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogsModal(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles - {selectedDeployment?.project}</DialogTitle>
              <DialogDescription>Información del deployment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <StatusBadge status={selectedDeployment?.status || "stopped"} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    {selectedDeployment?.branch}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commit</p>
                  <p className="text-sm font-medium text-foreground">{selectedDeployment?.commit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo</p>
                  <p className="text-sm font-medium text-foreground">{selectedDeployment?.time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">URL</p>
                <a
                  href={`https://${selectedDeployment?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  https://{selectedDeployment?.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleViewLogs(selectedDeployment!)}>
                <FileText className="mr-2 h-4 w-4" />
                Ver Logs
              </Button>
              <Button
                onClick={() => {
                  if (selectedDeployment) handleRedeploy(selectedDeployment.id)
                  setShowDetailsModal(false)
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Redeploy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
