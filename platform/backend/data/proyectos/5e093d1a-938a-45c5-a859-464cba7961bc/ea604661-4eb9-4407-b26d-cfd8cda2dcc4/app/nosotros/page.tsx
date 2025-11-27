import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const ingredients = [
    { icon: "🥩", name: "Proteína Magra", desc: "Res y pollo bajo en grasa, atún, quinoa y lenteja" },
    { icon: "🥬", name: "Vegetales Frescos", desc: "Lechuga, tomate, espinaca, pepino y vegetales locales" },
    { icon: "🍞", name: "Pan Integral", desc: "Artesanal con mejor digestión y más fibra" },
    { icon: "🥑", name: "Aceites Saludables", desc: "Salsa yogurt light, crema de palta y salsas bajas en azúcar" },
  ]

  const values = [
    { icon: "❤️", title: "Salud", desc: "Cuidamos cada ingrediente" },
    { icon: "⭐", title: "Calidad", desc: "Productos frescos y seleccionados" },
    { icon: "🚀", title: "Innovación", desc: "Primera hamburguesería fit del rubro" },
    { icon: "💰", title: "Accesibilidad", desc: "Precios pensados para estudiantes" },
    { icon: "🤝", title: "Responsabilidad", desc: "Promovemos buenos hábitos" },
    { icon: "🎯", title: "Compromiso", desc: "Mejorar la vida de la comunidad" },
  ]

  const founders = [
    {
      name: "William Huacoto",
      role: "Co-Founder & CEO",
      avatar: "CL",
      foto: "/images/perfil/william.webp",
      color: "from-orange to-orange-dark",
      description: "Visionario y apasionado por la comida saludable.",
    },
    {
      name: "Miguel Quispe",
      role: "Co-Founder & Tecnologia",
      avatar: "MR",
      foto: "/images/perfil/miguel.webp",
      color: "from-purple to-blue-bright",
      description: "Experto en marketing y tecnologías digitales.",
    },
    {
      name: "Oliver Laura",
      role: "Co-Founder & Finanzas",
      avatar: "OL",
      foto: "/images/perfil/oli.webp",
      color: "from-green-500 to-emerald-600",
      description: "Especialista en gestión financiera y contabilidad",
    },
    {
      name: "Brayan Apaza",
      role: "Co-Founder & Logistica",
      foto: "/images/perfil/brayan.webp",
      avatar: "BA",
      color: "from-green-500 to-emerald-600",
      description: "Especialista en operaciones y logística",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange/10 via-purple/10 to-blue-bright/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            Burger Fit:{" "}
            <span className="bg-linear-to-r from-orange via-purple to-blue-bright bg-clip-text text-transparent">
              Comida Saludable con Sabor
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl">
            Nacimos en El Alto con una misión: demostrar que comer rico no tiene que ser dañino para tu salud.
          </p>
        </div>
      </section>

      {/* ¿Quiénes Somos? */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">¿Quiénes Somos?</h2>
              <p className="text-lg text-foreground/70 mb-4 leading-relaxed">
                Somos Burger Fit, un emprendimiento boliviano creado para ofrecer una alternativa saludable a la comida
                rápida tradicional. Nuestro enfoque está en preparar hamburguesas fitness, ricas en proteína, bajas en
                grasa y elaboradas con aceites saludables, ingredientes naturales y panes integrales.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Nacimos con la idea de demostrar que comer rico no tiene por qué ser dañino para tu salud.
              </p>
            </div>
            <div className="bg-linear-to-br from-orange/20 to-orange/5 rounded-2xl p-8 border border-orange/30">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-4xl">🍔</span>
                  <div>
                    <h3 className="font-bold text-lg">Alternativa Saludable</h3>
                    <p className="text-sm text-foreground/60">Comida rápida con conciencia nutricional</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-4xl">⚡</span>
                  <div>
                    <h3 className="font-bold text-lg">100% Fresca</h3>
                    <p className="text-sm text-foreground/60">Ingredientes naturales y seleccionados</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-lg">Para Ti</h3>
                    <p className="text-sm text-foreground/60">
                      Pensada para estudiantes, deportistas y amantes del fitness
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Filosofía */}
      <section className="py-16 md:py-24 bg-linear-to-br from-muted/50 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Nuestro Propósito</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-orange/20 to-orange/5 rounded-2xl p-8 border border-orange/30 hover:border-orange/60 transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nuestra Misión</h3>
              <p className="text-foreground/70 leading-relaxed">
                Promover una alimentación saludable y accesible para jóvenes, estudiantes y personas con estilo de vida
                activo. Ser la opción ideal para quienes buscan equilibrio entre sabor, nutrición y bienestar.
              </p>
            </div>

            <div className="bg-linear-to-br from-purple/20 to-purple/5 rounded-2xl p-8 border border-purple/30 hover:border-purple/60 transition">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nuestra Visión</h3>
              <p className="text-foreground/70 leading-relaxed">
                Ser reconocidos como el primer concepto de hamburguesas fitness en El Alto, destacando por calidad,
                accesibilidad y por fomentar buenos hábitos alimentarios en la comunidad.
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-bright/20 to-blue-bright/5 rounded-2xl p-8 border border-blue-bright/30 hover:border-blue-bright/60 transition">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nuestra Filosofía</h3>
              <p className="text-foreground/70 leading-relaxed">
                Comida deliciosa sin culpas. Combinamos lo mejor de la comida rápida con lo mejor de la alimentación
                saludable, usando ingredientes frescos, proteína magra, aceites saludables y recetas artesanales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredientes */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Ingredientes que Usamos</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {ingredients.map((ing, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border-2 transition hover:shadow-lg hover:scale-105 ${
                  idx === 0
                    ? "bg-linear-to-br from-orange/10 to-orange/5 border-orange/30"
                    : idx === 1
                      ? "bg-linear-to-br from-green-500/10 to-green-500/5 border-green-500/30"
                      : idx === 2
                        ? "bg-linear-to-br from-purple/10 to-purple/5 border-purple/30"
                        : "bg-linear-to-br from-blue-bright/10 to-blue-bright/5 border-blue-bright/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{ing.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{ing.name}</h3>
                    <p className="text-foreground/70">{ing.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-24 bg-linear-to-br from-muted/50 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Nuestros Valores</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-card rounded-xl p-6 border border-border hover:border-orange/60 transition hover:shadow-lg"
              >
                <div className="text-4xl mb-3">{val.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{val.title}</h3>
                <p className="text-foreground/70">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Conoce a Nuestros Fundadores</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {founders.map((founder, idx) => (
              <div
                key={idx}
                className="bg-linear-to-br from-card to-card/50 rounded-2xl p-8 border border-border hover:border-orange/60 transition hover:shadow-xl hover:scale-105 text-center"
              >

                {founder.foto ? (
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                    <Image src={founder.foto} alt={founder.name} width={96} height={96} />
                  </div>
                ) : (
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br ${founder.color} flex items-center justify-center text-white font-bold text-3xl shadow-lg`}
                >
                  {founder.avatar}
                </div>)}


                <h3 className="text-2xl font-bold text-foreground mb-2">{founder.name}</h3>
                <p className="text-orange font-semibold mb-3">{founder.role}</p>
                <p className="text-foreground/70 leading-relaxed">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Origen */}
      <section className="py-16 md:py-24 bg-linear-to-br from-muted/50 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-linear-to-br from-purple/20 to-purple/5 rounded-2xl p-8 border-2 border-purple/30">
              <h2 className="text-4xl font-bold text-foreground mb-6">Nuestro Origen</h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  <span className="font-bold text-foreground">Burger Fit</span> nació como un proyecto académico de la
                  Universidad Pública de El Alto (UPEA) elaborado por estudiantes de Ingeniería de Sistemas.
                </p>
                <p>
                  El proyecto analizó el mercado joven y estudiantil, la necesidad de comida accesible y saludable, la
                  cultura alimentaria de la ciudad, y la falta de opciones fitness reales.
                </p>
                <p>Todo esto nos motivó a crear una propuesta innovadora, moderna y saludable para El Alto.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-linear-to-br from-orange/20 to-orange/5 rounded-xl p-6 border-2 border-orange/30">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-3xl">🎓</span> Origen Académico
                </h3>
                <p className="text-foreground/70">Proyecto de estudiantes de Ingeniería de Sistemas de la UPEA</p>
              </div>

              <div className="bg-linear-to-br from-blue-bright/20 to-blue-bright/5 rounded-xl p-6 border-2 border-blue-bright/30">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-3xl">🏙️</span> Hecho en El Alto
                </h3>
                <p className="text-foreground/70">Para El Alto, pensado en estudiantes y deportistas locales</p>
              </div>

              <div className="bg-linear-to-br from-green-500/20 to-green-500/5 rounded-xl p-6 border-2 border-green-500/30">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-3xl">💚</span> Por Qué en El Alto
                </h3>
                <p className="text-foreground/70">
                  El Alto es joven, dinámica y llena de estudiantes que merecen opciones saludables
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-orange/30 via-purple/20 to-blue-bright/30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">¿Listo para Probar Burger Fit?</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Ven a experimentar la diferencia. Nuestro equipo está listo para servir te la mejor hamburguesa saludable
            hecha con amor y dedicación.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/menu"
              className="inline-block bg-linear-to-r from-orange to-orange-dark text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition hover:scale-105"
            >
              Ver Menú
            </Link>
            <Link
              href="/contacto"
              className="inline-block bg-linear-to-r from-purple to-blue-bright text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition hover:scale-105"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
