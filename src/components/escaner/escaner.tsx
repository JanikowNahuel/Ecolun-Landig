"use client";

import type { MotionValue } from "framer-motion";
import { useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import transductorQuieto from "@/assets/transductor-quieto.png";
import type { EtapaEmbarazo } from "@/types/contenido";
import { inclinacionTransductor } from "@/lib/embarazo/linea-de-tiempo";
import { cn } from "@/lib/cn";
import { MonitorEco } from "./monitor-eco";

// three.js pesa: se carga aparte y solo en el navegador
const Transductor3D = dynamic(() => import("./transductor-3d"), { ssr: false });

type Props = {
  etapas: EtapaEmbarazo[];
  progreso: MotionValue<number>;
  visibles: MotionValue<number>[];
  reducir: boolean;
  className?: string;
};

/**
 * Consola del ecógrafo: transductor 3D arriba y monitor abajo. El lienzo 3D
 * termina justo en el borde superior de la imagen, donde está el vértice del
 * abanico; ahí el haz del transductor sigue como barrido en el monitor.
 * La altura del lienzo la define --alto-transductor.
 */
export function Escaner({ etapas, progreso, visibles, reducir, className }: Props) {
  const n = etapas.length;
  const caja = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);
  const [cerca, setCerca] = useState(false);
  const [listo, setListo] = useState(false);

  // three.js (~270 KB) se descarga recién cuando la consola está a medio
  // pantalla de entrar, y solo dibuja mientras se ve. Hasta entonces, una foto fija del
  // mismo transductor (también queda si el navegador no tiene WebGL).
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const lejos = new IntersectionObserver(([e]) => e.isIntersecting && setCerca(true), { rootMargin: "500px 0px" });
    const enPantalla = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { rootMargin: "100px" });
    lejos.observe(el);
    enPantalla.observe(el);
    return () => {
      lejos.disconnect();
      enPantalla.disconnect();
    };
  }, []);

  const inclinacion = useTransform(progreso, (p) => inclinacionTransductor(p, n));
  const giro = useTransform(progreso, (p) => p * 1.1);

  return (
    <div
      ref={caja}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-[radial-gradient(120%_70%_at_50%_0%,#1d3a3c_0%,#0b1718_60%,#071011_100%)] p-3 shadow-[0_30px_80px_-30px_rgba(14,36,38,0.75)] ring-1 ring-white/5 [--alto-transductor:7.5rem] sm:p-4 sm:[--alto-transductor:13rem] lg:[--alto-transductor:15rem]",
        className,
      )}
    >
      {/* padding (no margin en el monitor): un margin colapsaría y arrastraría el lienzo */}
      <div className="relative pt-[calc(var(--alto-transductor)_-_1.75rem)]">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 z-10 h-[var(--alto-transductor)] w-[var(--alto-transductor)] -translate-x-1/2"
        >
          <Image
            src={transductorQuieto}
            alt=""
            fill
            sizes="240px"
            className={cn("object-contain transition-opacity duration-500", listo && "opacity-0")}
          />
          {cerca && (
            <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500", listo && "opacity-100")}>
              <Transductor3D
                inclinacion={inclinacion}
                giro={giro}
                reducir={reducir}
                activo={activo}
                alEstarListo={() => setListo(true)}
              />
            </div>
          )}
        </div>
        <MonitorEco etapas={etapas} progreso={progreso} visibles={visibles} />
      </div>
    </div>
  );
}
