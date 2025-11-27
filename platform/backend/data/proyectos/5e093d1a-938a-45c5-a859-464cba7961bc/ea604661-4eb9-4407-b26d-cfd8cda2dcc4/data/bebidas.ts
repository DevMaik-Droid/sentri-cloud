import { Bebida } from "@/types/producto";

export const bebidas: Bebida[] = [
  {
    id: 1,
    nombre: "Lemon Mint Detox",
    descripcion: "Bebida ligera y refrescante de limón con menta natural.",
    ingredientes: [
      { nombre: "Limón", icon: "🍋", color: "text-yellow-500" },
      { nombre: "Menta fresca", icon: "🌿", color: "text-green-500" },
      { nombre: "Agua purificada", icon: "💧", color: "text-sky-400" },
      { nombre: "Endulzante natural", icon: "🍯", color: "text-amber-400" }
    ],
    calorias: 25,
    proteina: "0g",
    precio: 10,
    imagen: "/images/productos/bebidas/lemon-mint.webp",
    color: "from-green-200 to-emerald-200",
    bgGradient: "from-green-100/30 to-emerald-100/30"
  },

  {
    id: 2,
    nombre: "Power Protein Shake",
    descripcion: "Batido proteico sabor vainilla para energía limpia.",
    ingredientes: [
      { nombre: "Proteína whey vainilla", icon: "🥛", color: "text-amber-500" },
      { nombre: "Leche descremada", icon: "🥛", color: "text-sky-500" },
      { nombre: "Hielo", icon: "🧊", color: "text-blue-400" },
      { nombre: "Vainilla natural", icon: "🌼", color: "text-yellow-400" }
    ],
    calorias: 160,
    proteina: "24g",
    precio: 15,
    imagen: "/images/productos/bebidas/protein-vainilla.webp",
    color: "from-amber-200 to-yellow-200",
    bgGradient: "from-amber-100/30 to-yellow-100/30"
  },

  {
    id: 3,
    nombre: "Berry Fit Smoothie",
    descripcion: "Smoothie antioxidante de frutos rojos con yogurt natural.",
    ingredientes: [
      { nombre: "Frutilla", icon: "🍓", color: "text-rose-400" },
      { nombre: "Arándano", icon: "🫐", color: "text-blue-500" },
      { nombre: "Mora", icon: "🍇", color: "text-purple-500" },
      { nombre: "Yogurt natural", icon: "🥛", color: "text-sky-400" }
    ],
    calorias: 140,
    proteina: "6g",
    precio: 14,
    imagen: "/images/productos/bebidas/berry-smoothie.webp",
    color: "from-pink-200 to-purple-200",
    bgGradient: "from-pink-100/30 to-purple-100/30"
  },

  {
    id: 4,
    nombre: "Green Energy Juice",
    descripcion: "Jugo verde energizante ideal para deportistas.",
    ingredientes: [
      { nombre: "Manzana verde", icon: "🍏", color: "text-green-500" },
      { nombre: "Espinaca", icon: "🌿", color: "text-emerald-500" },
      { nombre: "Pepino", icon: "🥒", color: "text-green-400" },
      { nombre: "Jengibre", icon: "🫚", color: "text-amber-500" }
    ],
    calorias: 70,
    proteina: "2g",
    precio: 12,
    imagen: "/images/productos/bebidas/green-energy.webp",
    color: "from-emerald-200 to-green-200",
    bgGradient: "from-emerald-100/30 to-green-100/30"
  },

  {
    id: 5,
    nombre: "Mango Light Refresco",
    descripcion: "Refresco helado de mango natural sin azúcar añadida.",
    ingredientes: [
      { nombre: "Pulpa de mango", icon: "🥭", color: "text-orange-400" },
      { nombre: "Agua fría", icon: "💧", color: "text-sky-400" },
      { nombre: "Hielo", icon: "🧊", color: "text-blue-400" },
      { nombre: "Endulzante natural", icon: "🍯", color: "text-amber-400" }
    ],
    calorias: 80,
    proteina: "1g",
    precio: 12,
    imagen: "/images/productos/bebidas/mango-light.webp",
    color: "from-orange-200 to-yellow-200",
    bgGradient: "from-orange-100/30 to-yellow-100/30"
  }
];
