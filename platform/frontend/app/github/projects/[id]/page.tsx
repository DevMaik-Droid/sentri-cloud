import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  GitBranch,
  GitCommit,
  Rocket,
  FileText,
  Unlink,
  Clock,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface GitHubProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function GitHubProjectPage({ params }: GitHubProjectPageProps) {
  const { id } = await params

  // Mock data
  const project = {
    id,
    name: "my-nextjs-app",
    repo: "johndoe/my-nextjs-app",
    branch: "main",
    status: "running" as const,
    url: "nextjs-app.sentri.lat",
    lastCommit: {
      message: "feat: add authentication flow",
      sha: "abc1234",
      author: "John Doe",
      time: "hace 2 horas",
    },
    lastBuild: "hace 2 horas",
    buildTime: "1m 23s",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/github/repos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-4 mt-1">
              <a
                href={`https://github.com/${project.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {project.repo}
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-sm text-muted-foreground">•</span>
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {project.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Rama Trackeada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{project.branch}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Último Build
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{project.lastBuild}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Build Time
              </CardTitle>
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Último Commit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{project.lastCommit.message}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <code className="bg-muted px-2 py-0.5 rounded text-xs">{project.lastCommit.sha}</code>
                  <span>{project.lastCommit.author}</span>
                  <span>{project.lastCommit.time}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button>
            <Rocket className="mr-2 h-4 w-4" />
            Forzar Build Ahora
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Ver Logs
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
            <Unlink className="mr-2 h-4 w-4" />
            Desconectar GitHub
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Build Logs</CardTitle>
            <CardDescription>Salida del último proceso de build</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background rounded-lg p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
              <div className="space-y-1">
                <p>
                  <span className="text-primary">→</span> Fetching from github.com/{project.repo}...
                </p>
                <p>
                  <span className="text-success">✓</span> Cloned repository at commit {project.lastCommit.sha}
                </p>
                <p>
                  <span className="text-success">✓</span> Detected framework: Next.js
                </p>
                <p>
                  <span className="text-success">✓</span> Installing dependencies (npm install)...
                </p>
                <p>
                  <span className="text-success">✓</span> Dependencies installed in 32s
                </p>
                <p>
                  <span className="text-success">✓</span> Running build command: npm run build
                </p>
                <p>
                  <span className="text-success">✓</span> Build completed in 51s
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
      </div>
    </DashboardLayout>
  )
}
