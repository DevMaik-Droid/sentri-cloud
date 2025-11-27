"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-background via-background to-background border-b-2 border-orange/20 shadow-md backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/logo-p.webp" alt="FitBurger Logo" width={85} height={65}></Image>
            <span className="text-2xl font-bold bg-linear-to-r from-orange to-purple bg-clip-text text-transparent hidden sm:inline">
              BurgerFit
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground font-medium hover:text-orange transition relative group">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-orange to-purple group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/menu" className="text-foreground font-medium hover:text-orange transition relative group">
              Menú
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-orange to-purple group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/nosotros" className="text-foreground font-medium hover:text-orange transition relative group">
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-orange to-purple group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contacto" className="text-foreground font-medium hover:text-orange transition relative group">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-orange to-purple group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-orange/10 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} className="text-foreground" /> : <Menu size={28} className="text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <Link
              href="/"
              
              className="block py-3 px-4 text-foreground font-medium hover:bg-orange/10 rounded-lg transition"
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className="block py-3 px-4 text-foreground font-medium hover:bg-orange/10 rounded-lg transition"
            >
              Menú
            </Link>
            <Link
              href="/nosotros"
              className="block py-3 px-4 text-foreground font-medium hover:bg-orange/10 rounded-lg transition"
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="block py-3 px-4 text-foreground font-medium hover:bg-orange/10 rounded-lg transition"
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
