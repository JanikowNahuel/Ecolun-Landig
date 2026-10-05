import { Accessibility, ArrowDown, MessageCircle, ScanHeart, Star } from "lucide-react";
import { consultorio, sedePrincipal } from "@/content/consultorio";
import { linkWhatsApp } from "@/lib/whatsapp";
import { ArcosFondo } from "@/components/ui/arcos-fondo";
import { Boton } from "@/components/ui/boton";
import { Pildora } from "@/components/ui/pildora";
import { Resaltado } from "@/components/ui/resaltado";
import { PolaroidEco } from "./polaroid-eco";

const formatoNota = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function Hero() {
  return (
    <section id="inicio" className="fondo-teal relative overflow-hidden text-white">
      <ArcosFondo />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-32 sm:px-6 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8 lg:pt-24 lg:pb-28">
        <div>
          <Pildora className="border-white/55 text-white">Ecografías · Córdoba</Pildora>
          <h1 className="mt-6 text-[2.6rem] leading-[1.08] font-light tracking-tight sm:text-6xl lg:text-[4.1rem]">
            <span className="block">Acompañamos</span>
            <span className="block">tu embarazo</span>
            <span className="mt-3 block">
              <Resaltado>eco a eco</Resaltado>
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90">
            Ecografías obstétricas, ginecológicas y generales con la {consultorio.doctora.nombre}, sobre{" "}
            {sedePrincipal.direccion.replace(/\s\d+$/, "")}. Pedí tu turno por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Boton
              href={linkWhatsApp()}
              externo
              variante="claro"
              icono={<MessageCircle aria-hidden className="size-4.5" />}
            >
              Reservá tu turno
            </Boton>
            <Boton href="#embarazo" variante="contorno-claro">
              Ver ecos de embarazo
            </Boton>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <Star aria-hidden className="size-4 fill-menta text-menta" />
              {formatoNota.format(consultorio.calificacionGoogle)} en Google
            </li>
            <li className="flex items-center gap-2">
              <ScanHeart aria-hidden className="size-4 text-menta" />
              Todas las ecografías
            </li>
            {sedePrincipal.accesible && (
              <li className="flex items-center gap-2">
                <Accessibility aria-hidden className="size-4 text-menta" />
                Entrada accesible
              </li>
            )}
          </ul>
        </div>

        <div className="relative">
          <PolaroidEco />
        </div>
      </div>

      <a
        href="#embarazo"
        className="absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/25 lg:inline-flex"
      >
        deslizá y conocé más
        <ArrowDown aria-hidden className="size-4 animate-bounce motion-reduce:animate-none" />
      </a>

      {/* borde inferior curvo hacia la sección blanca */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-24 w-[170%] -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-white sm:h-32 sm:w-[140%]"
      />
    </section>
  );
}
