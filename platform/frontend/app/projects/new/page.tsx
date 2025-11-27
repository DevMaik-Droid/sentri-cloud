"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Check, Loader2, ArrowLeft, FileArchive, Cog, Rocket } from "lucide-react"
import Link from "next/link"

const runtimes = [
  { value: "nodejs20", label: "Node.js 20" },
  { value: "nodejs18", label: "Node.js 18" },
  { value: "python311", label: "Python 3.11" },
  { value: "go121", label: "Go 1.21" },
  { value: "static", label: "Static" },
]

const steps = [
  { id: 1, name: "Subir ZIP", icon: FileArchive },
  { id: 2, name: "Build", icon: Cog },
  { id: 3, name: "Deploy", icon: Rocket },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [runtime, setRuntime] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDeploy = async () => {
    if (!projectName || !runtime || !file) return

    setIsDeploying(true)

    // Simular flujo de deploy
    for (let i = 1; i <= 3; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    router.push("/projects")
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Crear Proyecto ZIP</h1>
            <p className="text-sm text-muted-foreground mt-1">Sube tu proyecto como archivo ZIP para desplegarlo</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Configuración del Proyecto</CardTitle>
            <CardDescription>Completa los detalles para crear tu proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                placeholder="mi-proyecto"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-background"
              />
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
                      {rt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Archivo ZIP</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input type="file" accept=".zip" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  {file ? (
                    <p className="text-sm text-foreground font-medium">{file.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Arrastra tu archivo ZIP o haz clic para seleccionar</p>
                  )}
                </label>
              </div>
            </div>

            {isDeploying && (
              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground">Progreso del Deploy</p>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          currentStep > step.id
                            ? "bg-success text-success-foreground"
                            : currentStep === step.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-4 w-4" />
                        ) : currentStep === step.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleDeploy}
              disabled={!projectName || !runtime || !file || isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desplegando...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Crear Proyecto
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
