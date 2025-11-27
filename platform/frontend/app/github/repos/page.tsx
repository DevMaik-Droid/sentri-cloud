"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  Search,
  Star,
  GitFork,
  Circle,
  ArrowRight,
  Loader2,
  Check,
  Rocket,
  GitBranch,
  ExternalLink,
} from "lucide-react"

const initialRepositories = [
  {
    id: "1",
    name: "my-nextjs-app",
    fullName: "usuario/my-nextjs-app",
    description: "A modern Next.js application with TypeScript and Tailwind",
    language: "TypeScript",
    stars: 45,
    forks: 12,
    branches: ["main", "develop", "feature/auth"],
    updated: "hace 2 días",
    imported: false,
  },
  {
    id: "2",
    name: "api-gateway",
    fullName: "usuario/api-gateway",
    description: "REST API Gateway built with Node.js and Express",
    language: "JavaScript",
    stars: 28,
    forks: 8,
    branches: ["main", "staging"],
    updated: "hace 5 días",
    imported: false,
  },
  {
    id: "3",
    name: "python-ml-service",
    fullName: "usuario/python-ml-service",
    description: "Machine learning microservice with FastAPI",
    language: "Python",
    stars: 67,
    forks: 23,
    branches: ["main", "develop", "v2"],
    updated: "hace 1 semana",
    imported: false,
  },
  {
    id: "4",
    name: "go-microservices",
    fullName: "usuario/go-microservices",
    description: "Microservices architecture with Go and gRPC",
    language: "Go",
    stars: 112,
    forks: 45,
    branches: ["main"],
    updated: "hace 2 semanas",
    imported: false,
  },
]

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Go: "bg-cyan-500",
}

export default function GitHubReposPage() {
  const [repositories, setRepositories] = useState(initialRepositories)
  const [searchQuery, setSearchQuery] = useState("")
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<(typeof repositories)[0] | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [autoDeploy, setAutoDeploy] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openImportModal = (repo: (typeof repositories)[0]) => {
    setSelectedRepo(repo)
    setSelectedBranch(repo.branches[0])
    setAutoDeploy(true)
    setImportSuccess(false)
    setShowImportModal(true)
  }

  const handleImport = async () => {
    if (!selectedRepo) return

    setImporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setImporting(false)
    setImportSuccess(true)

    setRepositories((prev) => prev.map((repo) => (repo.id === selectedRepo.id ? { ...repo, imported: true } : repo)))

    setTimeout(() => {
      setShowImportModal(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Repositorios de GitHub</h1>
          <p className="text-sm text-muted-foreground mt-1">Selecciona un repositorio para importar a Sentri Cloud</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar repositorios..."
            className="pl-10 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredRepos.map((repo) => (
            <Card key={repo.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://github.com/${repo.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-primary flex items-center gap-1.5"
                      >
                        {repo.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {repo.imported && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Importado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                  </div>
                  <Button
                    onClick={() => openImportModal(repo)}
                    disabled={repo.imported}
                    variant={repo.imported ? "outline" : "default"}
                  >
                    {repo.imported ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Importado
                      </>
                    ) : (
                      <>
                        Importar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Circle className={`h-3 w-3 ${languageColors[repo.language] || "bg-gray-500"}`} />
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {repo.forks}
                  </div>
                  <span>Actualizado {repo.updated}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">{repo.branches.length} branches</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRepos.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron repositorios</h3>
                <p className="text-sm text-muted-foreground">Intenta con otro término de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de importación */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Importar Repositorio
            </DialogTitle>
            <DialogDescription>Configura la importación de {selectedRepo?.name} a Sentri Cloud</DialogDescription>
          </DialogHeader>

          {importSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Importación exitosa</h3>
              <p className="text-sm text-muted-foreground text-center">
                El repositorio se ha agregado a tus proyectos de GitHub
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Repositorio</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Circle className={`h-3 w-3 ${languageColors[selectedRepo?.language || ""] || "bg-gray-500"}`} />
                    <span className="font-medium text-foreground">{selectedRepo?.fullName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch a desplegar</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRepo?.branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            {branch}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-deploy">Auto-deploy</Label>
                    <p className="text-xs text-muted-foreground">Desplegar automáticamente en cada push</p>
                  </div>
                  <Switch id="auto-deploy" checked={autoDeploy} onCheckedChange={setAutoDeploy} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Importar proyecto
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
