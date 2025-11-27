"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function CallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = params.get("token")

    if (token) {
      login(token)
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [])

  return <div>Autenticado con exito</div>
}
