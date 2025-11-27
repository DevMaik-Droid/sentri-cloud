"use client"

import type React from "react"

import { useState } from "react"
import { Phone, MapPin, Send, MessageCircle, Clock, Utensils } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    teléfono: "",
    mensaje: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mensaje = `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.teléfono}\nMensaje: ${formData.mensaje}`
    window.open(`https://wa.me/59173054178?text=${encodeURIComponent(mensaje)}`, "_blank")
    setFormData({ nombre: "", email: "", teléfono: "", mensaje: "" })
  }

  return (
    <main className="min-h-screen bg-background py-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden mb-16">
        <div className="absolute inset-0 bg-linear-to-br from-orange/10 via-purple/10 to-blue-bright/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            <span className="bg-linear-to-r from-orange to-purple bg-clip-text text-transparent">¡Contáctanos!</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas, tomar tu pedido o simplemente saludar. Elige el método que
            prefieras.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Phone */}
          <div className="bg-linear-to-br from-orange/20 to-orange/5 rounded-2xl border-2 border-orange/30 p-8 text-center hover:border-orange hover:shadow-lg transition">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange to-orange-dark flex items-center justify-center mx-auto mb-4 text-white">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Teléfono</h3>
            <p className="text-foreground/70 text-lg font-semibold mb-2">+591 2 222 2222</p>
            <p className="text-sm text-foreground/60">Lun-Dom 11 AM - 10 PM</p>
          </div>

          {/* WhatsApp */}
          <div className="bg-linear-to-br from-green-500/20 to-green-500/5 rounded-2xl border-2 border-green-500/30 p-8 text-center hover:border-green-500 hover:shadow-lg transition">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">WhatsApp</h3>
            <p className="text-foreground/70 text-lg font-semibold mb-2">+591 73054178</p>
            <p className="text-sm text-foreground/60">Respuesta inmediata</p>
          </div>

          {/* Location */}
          <div className="bg-linear-to-br from-blue-bright/20 to-blue-bright/5 rounded-2xl border-2 border-blue-bright/30 p-8 text-center hover:border-blue-bright hover:shadow-lg transition">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-bright to-cyan-500 flex items-center justify-center mx-auto mb-4 text-white">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Ubicación</h3>
            <p className="text-foreground/70 font-semibold mb-2">El Alto, Bolivia</p>
            <p className="text-sm text-foreground/60">Zona céntrica</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Formulario */}
          <div className="bg-card rounded-2xl border-2 border-border p-8">
            <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="text-4xl">📝</span> Envía tu Mensaje
            </h2>
            <p className="text-foreground/60 mb-6">Completa el formulario y nos pondremos en contacto pronto.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-foreground mb-2">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-orange outline-none transition"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-orange outline-none transition"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="teléfono" className="block text-sm font-semibold text-foreground mb-2">
                  Teléfono o WhatsApp
                </label>
                <input
                  type="tel"
                  id="teléfono"
                  name="teléfono"
                  value={formData.teléfono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-orange outline-none transition"
                  placeholder="+591 XXXXXXXX"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-foreground mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-orange outline-none transition resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-orange to-orange-dark text-white py-4 rounded-lg font-bold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-lg"
              >
                <Send size={20} />
                Enviar por WhatsApp
              </button>
            </form>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Horarios */}
            <div className="bg-linear-to-br from-purple/20 to-purple/5 rounded-2xl p-8 border-2 border-purple/30">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock size={28} className="text-purple" />
                Horarios de Atención
              </h3>
              <div className="space-y-3 text-foreground/70">
                <div className="flex justify-between pb-3 border-b border-purple/20">
                  <span className="font-semibold">Lunes - Viernes:</span>
                  <span className="text-foreground font-bold">11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-purple/20">
                  <span className="font-semibold">Sábado:</span>
                  <span className="text-foreground font-bold">12:00 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Domingo:</span>
                  <span className="text-foreground font-bold">12:00 PM - 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Promociones */}
            <div className="bg-linear-to-br from-orange/20 to-orange/5 rounded-2xl p-8 border-2 border-orange/30">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Utensils size={28} className="text-orange" />
                Promociones
              </h3>
              <ul className="space-y-2 text-foreground/70">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange"></span>
                  Combo Fitness - Burger + Bebida + Fritas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange"></span>
                  Descuento 10% para estudiantes (con carnet)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange"></span>
                  Promociones los viernes y fines de semana
                </li>
              </ul>
            </div>

            {/* FAQs */}
            <div className="bg-linear-to-br from-blue-bright/20 to-blue-bright/5 rounded-2xl p-8 border-2 border-blue-bright/30">
              <h3 className="text-2xl font-bold text-foreground mb-4">Preguntas Frecuentes</h3>
              <ul className="space-y-3 text-sm text-foreground/70">
                <li>
                  <span className="font-semibold text-foreground">¿Vegetariano?</span> Sí, contamos con opciones fit
                </li>
                <li>
                  <span className="font-semibold text-foreground">¿Entregas?</span> Sí, contáctanos vía WhatsApp
                </li>
                <li>
                  <span className="font-semibold text-foreground">¿Personalizar?</span> Claro, adaptamos cada burger
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
