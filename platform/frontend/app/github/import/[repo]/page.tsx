"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Github, GitBranch, Loader2, Rocket, Check } from "lucide-react"
import Link from "next/link"

const runtimes = [
  { value: "nodejs20", label: "Node.js 20", detected: true },
  { value: "nodejs18", label: "Node.js 18" },
  { value: "python311", label: "Python 3.11" },
  { value: "go121", label: "Go 1.21" },
  { value: "static", label: "Static" },
]

const branches = ["main", "develop", "feature/auth", "staging"]

interface GitHubImportPageProps {
  params: Promise<{ repo: string }>
}

export default function GitHubImportPage({ params }: GitHubImportPageProps) {
  const { repo } = use(params)
  const router = useRouter()
  const [projectName, setProjectName] = useState("my-nextjs-app")
  const [branch, setBranch] = useState("main")
  const [runtime, setRuntime] = useState("nodejs20")
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    setIsImporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/github/projects/${repo}`)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/github/repos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Importar Repositorio</h1>
            <p className="text-sm text-muted-foreground mt-1">Configura el deploy para tu repositorio de GitHub</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Github className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <CardTitle>my-nextjs-app</CardTitle>
                <CardDescription>github.com/johndoe/my-nextjs-app</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto en Sentri Cloud</Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Rama a trackear</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecciona una rama" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        {b}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="runtime">Runtime</Label>
              <Select value={runtime} onValueChange={setRuntime}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecciona un runtime" />
                </SelectTrigger>
                <SelectContent>
                  {runtimes.map((rt) => (
                    <SelectItem key={rt.value} value={rt.value}>
                      <div className="flex items-center gap-2">
                        {rt.label}
                        {rt.detected && (
                          <span className="text-xs bg-success/10 text-success px-1.5 py-0.5 rounded">
                            Auto-detectado
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="font-medium text-foreground">Configuración de Auto-deploy</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-success" />
                  Deploy automático en cada push a <code className="text-foreground">{branch}</code>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-success" />
                  Preview deployments para pull requests
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-success" />
                  Notificaciones de estado en GitHub
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Configurar Auto-deploy
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
