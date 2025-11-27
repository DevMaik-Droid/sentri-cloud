"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Loader2, Github } from "lucide-react"


export default function LoginPage() {
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/github/login`;
    
    setIsGithubLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <Cloud className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Sentri Cloud</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bienvenido de nuevo</h1>
          <p className="text-sm text-muted-foreground mt-2">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Iniciar sesión</CardTitle>
            <CardDescription>Elige tu método de autenticación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGithubLogin}
              disabled={isGithubLoading}
            >
              {isGithubLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando con GitHub...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Continuar con GitHub
                </>
              )}
            </Button>

          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="underline hover:text-foreground">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline hover:text-foreground">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  )
}
