import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, GitBranch, Zap, Shield, Check } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Zap,
    title: "Auto-deploy con cada push",
    description: "Cada vez que hagas push a tu rama, se desplegará automáticamente",
  },
  {
    icon: GitBranch,
    title: "Preview de branches",
    description: "Cada branch tendrá su propia URL de preview para pruebas",
  },
  {
    icon: Shield,
    title: "Acceso solo a repos seleccionados",
    description: "Tú eliges qué repositorios importar, sin acceso completo a tu cuenta",
  },
]

export default function GitHubConnectPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Github className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Conectar con GitHub</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Vincula tu cuenta de GitHub para importar repositorios y configurar deployments automáticos
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Beneficios de conectar GitHub</CardTitle>
            <CardDescription>Aprovecha todas las ventajas de la integración con GitHub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Al conectar, serás redirigido a GitHub para autorizar el acceso
              </p>
              <Button size="lg" className="w-full max-w-sm" asChild>
                <Link href="/github/repos">
                  <Github className="mr-2 h-5 w-5" />
                  Conectar con GitHub
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-success" />
                Conexión segura mediante OAuth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
