"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Github, Bell, Trash2, Check, Loader2, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [githubConnected, setGithubConnected] = useState(true)
  const [notifications, setNotifications] = useState({
    deploySuccess: true,
    deployError: true,
    weeklySummary: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDisconnectGithub = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setGithubConnected(false)
  }

  const handleConnectGithub = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setGithubConnected(true)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra tu cuenta y preferencias</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Tu información personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline">Cambiar avatar</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardado
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Conexión con GitHub
            </CardTitle>
            <CardDescription>Gestiona tu integración con GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            {githubConnected ? (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm text-foreground">Conectado como @johndoe</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnectGithub}>
                  Desconectar
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No conectado</span>
                </div>
                <Button size="sm" onClick={handleConnectGithub}>
                  <Github className="mr-2 h-4 w-4" />
                  Conectar GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configura cómo recibir notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email de deploy exitoso</p>
                <p className="text-sm text-muted-foreground">Recibe un email cuando un deploy sea exitoso</p>
              </div>
              <Switch
                checked={notifications.deploySuccess}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, deploySuccess: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email de errores</p>
                <p className="text-sm text-muted-foreground">Recibe un email cuando un deploy falle</p>
              </div>
              <Switch
                checked={notifications.deployError}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, deployError: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Resumen semanal</p>
                <p className="text-sm text-muted-foreground">Recibe un resumen semanal de tu actividad</p>
              </div>
              <Switch
                checked={notifications.weeklySummary}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklySummary: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Zona de peligro
            </CardTitle>
            <CardDescription>Acciones irreversibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div>
                <p className="font-medium text-foreground">Eliminar cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Esta acción eliminará permanentemente tu cuenta y todos tus proyectos
                </p>
              </div>
              <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                Eliminar cuenta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de confirmación para eliminar cuenta */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Eliminar Cuenta
              </DialogTitle>
              <DialogDescription>
                Esta acción es irreversible. Se eliminarán todos tus proyectos, deployments y datos asociados.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para confirmar, escribe{" "}
                <span className="font-mono font-medium text-foreground">eliminar mi cuenta</span> en el campo de abajo:
              </p>
              <Input
                placeholder="eliminar mi cuenta"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="bg-background"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation("")
                }}
              >
                Cancelar
              </Button>
              <Button variant="destructive" disabled={deleteConfirmation !== "eliminar mi cuenta"}>
                Eliminar Cuenta Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
