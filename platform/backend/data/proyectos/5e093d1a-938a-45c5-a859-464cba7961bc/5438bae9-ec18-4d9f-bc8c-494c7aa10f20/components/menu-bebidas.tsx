import { Flame, Leaf } from "lucide-react";
import { bebidas } from "@/data/bebidas";

import Image from "next/image";


interface MenuProps {

    handleReserve: (nombre: string) => void;

}
const MenuBebidas = ( { handleReserve }: MenuProps) => {

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {bebidas.map((burger) => (
          <div key={burger.id} className="group relative h-full">
            <div
              className={`absolute -inset-1 bg-linear-to-r ${burger.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300`}
            />

            <div
              className={`relative bg-linear-to-br ${burger.bgGradient} rounded-2xl border-2 border-orange/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full`}
            >
              <div className="relative h-56 overflow-hidden bg-linear-to-br from-background to-background/80">
                <Image
                  src={burger.imagen}
                  alt={burger.nombre}
                  width={280}
                  height={224}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 bg-linear-to-t ${burger.color} opacity-20 group-hover:opacity-40 transition-opacity`}
                />

                <div className="absolute top-4 right-4 bg-orange text-white font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                  Bs {burger.precio}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between p-6 relative">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-transparent bg-linear-to-r from-orange via-orange-light to-orange-dark bg-clip-text drop-shadow-lg">
                    {burger.nombre}
                  </h3>
                </div>

                <p className="text-foreground/70 text-sm font-medium text-center mb-4">
                  {burger.descripcion}
                </p>

                <div
                  className={`bg-linear-to-r ${burger.bgGradient} rounded-xl p-4 border border-orange/20 mb-4`}
                >
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Flame size={18} className="text-orange" />
                      <span className="font-semibold text-foreground">
                        {burger.calorias}
                      </span>
                    </div>
                    <div className="w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <Leaf size={18} className="text-green-500" />
                      <span className="font-semibold text-foreground">
                        {burger.proteina}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold text-foreground/60 mb-3 uppercase tracking-wider text-center">
                    Ingredientes Premium
                  </p>
                  <div className="space-y-2">
                    {burger.ingredientes.map((ing, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-orange/10 hover:border-orange/30"
                      >
                        <span className="text-xl">{ing.icon}</span>
                        <span
                          className={`text-sm font-medium text-foreground flex-1`}
                        >
                          {ing.nombre}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${ing.color} shadow-lg`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleReserve(burger.nombre)}
                  className="w-full bg-linear-to-r from-orange to-orange-dark hover:from-orange-dark hover:to-orange text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl uppercase text-sm tracking-wider"
                >
                  Reservar Ahora
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBebidas;
