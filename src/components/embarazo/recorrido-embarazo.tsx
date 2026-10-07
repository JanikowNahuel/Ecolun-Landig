"use client";

import { useScroll, useSpring } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useCallback, useRef } from "react";
import { etapasEmbarazo } from "@/content/embarazo";
import { useReducirMovimiento } from "@/hooks/use-reducir-movimiento";
import { useVentanasEtapas } from "@/hooks/use-ventanas-etapas";
import { centroEtapa } from "@/lib/embarazo/linea-de-tiempo";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Escaner } from "@/components/escaner/escaner";
import { ArcosFondo } from "@/components/ui/arcos-fondo";
import { Boton } from "@/components/ui/boton";
import { Resaltado } from "@/components/ui/resaltado";
import { BarraEtapas } from "./barra-etapas";
import { TextoEtapa } from "./texto-etapa";

const N = etapasEmbarazo.length;

/**
 * "Tu embarazo, eco a eco". La sección mide ~5,2 pantallas; el contenido
 * queda fijo (sticky) y el scroll dentro de ella mueve una sola línea de
 * tiempo de 0 a 1.
 *
 * Con "reducir movimiento" activo la animación se mantiene, porque la maneja
 * la persona con su propio scroll (y Windows Server o los "efectos de
 * animación" apagados lo activan sin que nadie lo haya pedido). Lo que se
 * saca es lo que se mueve solo: el suavizado con resorte, el deslizamiento
 * de los textos, el balanceo del transductor, las ondas del haz y el scroll
 * animado de la barra.
 */
function Titulo({ id }: { id?: string }) {
  return (
    <header>
      <p className="etiqueta text-teal-profundo">02 — Tu embarazo</p>
      <h2
        id={id}
        className="mt-3 text-[1.7rem] leading-[1.2] font-light text-teal-profundo sm:text-4xl lg:text-[2.6rem]"
      >
        Cada etapa <Resaltado variante="banda">merece su control</Resaltado>
      </h2>
    </header>
  );
}

function PieRecorrido() {
  return (
    <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
      <Boton href={linkWhatsApp("de embarazo")} externo icono={<MessageCircle aria-hidden className="size-4.5" />}>
        Reservá tu eco de embarazo
      </Boton>
      <p className="max-w-56 text-xs leading-snug text-tinta-suave">
        Las semanas son orientativas: tu obstetra te indica cuándo hacer cada una.
      </p>
    </div>
  );
}

export function RecorridoEmbarazo() {
  const reducir = useReducirMovimiento();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const suavizado = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.35, restDelta: 0.0005 });
  const progreso = reducir ? scrollYProgress : suavizado;
  const visibles = useVentanasEtapas(progreso, N, 0.05);

  const irAEtapa = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const recorrido = el.offsetHeight - window.innerHeight;
      const inicio = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: inicio + recorrido * centroEtapa(i, N), behavior: reducir ? "auto" : "smooth" });
    },
    [reducir],
  );

  return (
    <section id="embarazo" aria-labelledby="titulo-embarazo" className="relative bg-white">
      {/* el tramo alto es el que mide el scroll; lo que venga después no se monta encima del sticky */}
      <div ref={ref} data-recorrido-embarazo className="relative h-[520svh]">
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
          <ArcosFondo tono="oscuro" className="opacity-60" />
          <div className="relative mx-auto grid w-full max-w-6xl flex-1 content-center items-center gap-5 px-4 pt-20 pb-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16 lg:px-8 lg:pt-24">
            <div className="order-2 lg:order-1">
              <div className="hidden lg:block">
                <Titulo id="titulo-embarazo" />
              </div>
              <div className="relative min-h-[14.5rem] sm:min-h-[14rem] [@media(max-height:720px)]:min-h-[10.5rem] lg:mt-10 lg:min-h-[17rem]">
                {etapasEmbarazo.map((e, i) => (
                  <TextoEtapa key={e.id} etapa={e} visible={visibles[i]} deslizar={!reducir} />
                ))}
              </div>
              <BarraEtapas etapas={etapasEmbarazo} progreso={progreso} irAEtapa={irAEtapa} />
              <div className="hidden lg:block">
                <PieRecorrido />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-2 lg:hidden">
                <p className="etiqueta text-teal-profundo">02 — Tu embarazo, eco a eco</p>
              </div>
              <Escaner
                etapas={etapasEmbarazo}
                progreso={progreso}
                visibles={visibles}
                reducir={reducir}
                className="mx-auto w-full max-w-[min(100%,36svh)] lg:max-w-[480px]"
              />
            </div>
          </div>
        </div>
      </div>
      {/* en mobile el CTA va después del tramo fijo, para no apretar la pantalla */}
      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:hidden">
        <PieRecorrido />
      </div>
    </section>
  );
}
