import Link from "next/link"
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-orange/10 to-background border-t-2 border-orange/20 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo-p.webp" alt="FitBurger Logo" width={82} height={32}></Image>
              <h3 className="font-bold text-xl text-foreground">BurgerFit</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Hamburguesas saludables hechas con los mejores ingredientes para tu bienestar.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Navegación</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="text-foreground/70 hover:text-orange transition">
                Inicio
              </Link>
              <br />
              <Link href="/menu" className="text-foreground/70 hover:text-orange transition">
                Menú
              </Link>
              <br />
              <Link href="/nosotros" className="text-foreground/70 hover:text-orange transition">
                Nosotros
              </Link>
              <br />
              <Link href="/contacto" className="text-foreground/70 hover:text-orange transition">
                Contacto
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground/70">
                <MapPin size={16} className="shrink-0 text-orange" />
                <span>El Alto, Bolivia</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Phone size={16} className="shrink-0 text-orange" />
                <span>+591 73054178</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Mail size={16} className="shrink-0 text-orange" />
                <span>info@fitburger.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center text-orange hover:bg-orange hover:text-white transition"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple/20 rounded-lg flex items-center justify-center text-purple hover:bg-purple hover:text-white transition"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition"
                title="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-orange/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
            <p>&copy; 2025 FitBurger. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-orange transition">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-orange transition">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
