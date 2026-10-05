"use client";

import { motion, motionValue, useScroll, useTransform } from "framer-motion";
import { PantallaEcografo } from "@/components/embarazo/pantalla-ecografo";
import { centroEtapa } from "@/lib/embarazo/linea-de-tiempo";

/** La polaroid muestra la eco de las 12 semanas (segunda etapa). */
const PROGRESO_POLAROID = motionValue(centroEtapa(1));

/**
 * Polaroid con chinche (recurso 7 de la guía): foto de eco en marco de papel,
 * inclinada y con sombra. Al scrollear se endereza y sube un poco (va atado
 * al scroll, así que se mantiene aunque esté activo "reducir movimiento").
 */
export function PolaroidEco() {
  const { scrollY } = useScroll();
  const rotar = useTransform(scrollY, [0, 500], [4, -2]);
  const subir = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <motion.figure
      style={{ rotate: rotar, y: subir }}
      className="relative mx-auto w-[min(78vw,360px)] rounded-[0.4rem] bg-[#fbf8f1] p-3.5 pb-14 shadow-[0_28px_60px_-18px_rgba(10,32,34,0.55)] sm:p-4 sm:pb-16"
    >
      {/* chinche */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4e3c8,#c8a676_60%,#9c7c4f)] shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
      />
      <PantallaEcografo progreso={PROGRESO_POLAROID} compacto className="rounded-[0.2rem]" />
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-mano text-2xl text-tinta-suave sm:bottom-4 sm:text-[1.7rem]">
        ¡hola, bebé! · sem 12
      </figcaption>
    </motion.figure>
  );
}
