"use client"

import { Star } from "lucide-react"
import Menu from "@/components/menu"
import MenuBebidas from "@/components/menu-bebidas"


export default function MenuPage() {


  
  const handleReserve = (nombre: string) => {
    const mensaje = `Hola, me gustaría reservar: ${nombre}`
    const numeroWhatsApp = "59173054178"
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank")
  }

  return (
    <main className="min-h-screen bg-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full mb-6 font-semibold text-sm">
            <Star size={18} fill="currentColor" />
            MENÚ GOURMET FIT
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-center mb-4 text-foreground">
            <span className="bg-linear-to-r from-orange via-orange-light to-orange-dark bg-clip-text text-transparent">
              Hamburguesas Fit
            </span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Descubre nuestras hamburguesas artesanales, diseñadas para tu salud sin sacrificar el sabor
          </p>
        </div>
        
        <Menu handleReserve={handleReserve}/>

        <div className="text-center m-16">
          <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full mb-6 font-semibold text-sm">
            <Star size={18} fill="currentColor" />
            MENÚ GOURMET FIT
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-center mb-4 text-foreground">
            <span className="bg-linear-to-r from-orange via-orange-light to-orange-dark bg-clip-text text-transparent">
              Bebidas Fit
            </span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Descubre nuestras bebidas saludables, diseñadas para complementar tu estilo de vida fit sin sacrificar el sabor
          </p>
        </div>
        <MenuBebidas handleReserve={handleReserve}/>

        
      </div>
    </main>
  )
}
