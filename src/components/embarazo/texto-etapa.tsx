"use client";

import { type MotionValue, motion, motionValue, useTransform } from "framer-motion";
import type { EtapaEmbarazo } from "@/types/contenido";
import { cn } from "@/lib/cn";

type Props = {
  etapa: EtapaEmbarazo;
  /** Opacidad 0–1 de esta etapa. Si no viene, se muestra fija (versión sin animación). */
  visible?: MotionValue<number>;
  /** Sube un poco al aparecer. Se apaga con "reducir movimiento". */
  deslizar?: boolean;
  className?: string;
};

/** Valor fijo en 1 para cuando el texto no se anima. */
const FIJO = motionValue(1);

export function TextoEtapa({ etapa, visible, deslizar = true, className }: Props) {
  const valor = visible ?? FIJO;
  // En secuencia, no cruzado: el texto que sale se va del todo antes de que
  // entre el siguiente (dos párrafos a media opacidad no se leen).
  const opacidad = useTransform(valor, [0, 0.5, 1], [0, 0, 1]);
  const y = useTransform(valor, [0.5, 1], deslizar ? [18, 0] : [0, 0]);
  return (
    <motion.article
      style={visible ? { opacity: opacidad, y } : undefined}
      className={cn(visible && "absolute inset-x-0 top-0", className)}
    >
      <span className="etiqueta inline-flex rounded-full border border-teal-profundo/40 px-3.5 py-1 text-teal-profundo">
        {etapa.rango}
      </span>
      <h3 className="mt-4 text-2xl font-semibold leading-tight text-tinta sm:text-[1.75rem]">{etapa.estudio}</h3>
      <p className="mt-1 text-base font-light text-teal-profundo sm:text-lg [@media(max-height:720px)]:hidden">
        {etapa.titulo}
      </p>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-tinta-suave sm:text-base [@media(max-height:720px)]:line-clamp-3">
        {etapa.texto}
      </p>
    </motion.article>
  );
}
