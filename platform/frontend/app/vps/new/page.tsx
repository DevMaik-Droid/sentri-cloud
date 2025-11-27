"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Server, Loader2, Check, Copy } from "lucide-react"
import Link from "next/link"

const osOptions = [
  { value: "ubuntu-22", label: "Ubuntu 22.04 LTS" },
  { value: "ubuntu-20", label: "Ubuntu 20.04 LTS" },
  { value: "debian-12", label: "Debian 12" },
  { value: "debian-11", label: "Debian 11" },
  { value: "centos-9", label: "CentOS Stream 9" },
  { value: "rocky-9", label: "Rocky Linux 9" },
]

const plans = [
  { id: "basic", name: "Basic", cpu: "2 vCPU", ram: "2 GB", storage: "25 GB SSD", price: "$5/mes" },
  { id: "standard", name: "Standard", cpu: "2 vCPU", ram: "4 GB", storage: "50 GB SSD", price: "$10/mes" },
  { id: "pro", name: "Pro", cpu: "4 vCPU", ram: "8 GB", storage: "100 GB SSD", price: "$20/mes" },
  { id: "enterprise", name: "Enterprise", cpu: "8 vCPU", ram: "16 GB", storage: "200 GB SSD", price: "$40/mes" },
]

export default function NewVPSPage() {
  
  const [serverName, setServerName] = useState("")
  const [os, setOs] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("standard")
  const [isCreating, setIsCreating] = useState(false)
  const [createdServer, setCreatedServer] = useState<{
    ip: string
    user: string
    password: string
  } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleCreate = async () => {
    if (!serverName || !os) return
    setIsCreating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setCreatedServer({
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      user: "root",
      password: "sk_live_" + Math.random().toString(36).substring(2, 15),
    })
    setIsCreating(false)
  }

  if (createdServer) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-success" />
              </div>
              <CardTitle>VPS Creado Exitosamente</CardTitle>
              <CardDescription>Tu servidor está listo para usar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nombre:</span>
                  <span className="text-sm font-medium text-foreground">{serverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{createdServer.ip}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(createdServer.ip, "ip")}
                    >
                      {copiedField === "ip" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Usuario:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{createdServer.user}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(createdServer.user, "user")}
                    >
                      {copiedField === "user" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Password:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{createdServer.password}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(createdServer.password, "password")}
                    >
                      {copiedField === "password" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <Link href="/vps">Ver mis VPS</Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setCreatedServer(null)
                    setServerName("")
                    setOs("")
                  }}
                >
                  Crear otro VPS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/vps">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Crear Nuevo VPS</h1>
            <p className="text-sm text-muted-foreground mt-1">Configura tu servidor virtual privado</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Configuración del Servidor</CardTitle>
            <CardDescription>Completa los detalles para crear tu VPS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Servidor</Label>
              <Input
                id="name"
                placeholder="mi-servidor"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="os">Sistema Operativo</Label>
              <Select value={os} onValueChange={setOs}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecciona un SO" />
                </SelectTrigger>
                <SelectContent>
                  {osOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Plan</Label>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-3 md:grid-cols-2">
                {plans.map((plan) => (
                  <Label
                    key={plan.id}
                    htmlFor={plan.id}
                    className={`flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{plan.name}</span>
                      <span className="text-sm font-semibold text-primary">{plan.price}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{plan.cpu}</p>
                      <p>{plan.ram} RAM</p>
                      <p>{plan.storage}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <Button className="w-full" onClick={handleCreate} disabled={!serverName || !os || isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando servidor...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Crear VPS
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
