"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import type { EtapaEmbarazo } from "@/types/contenido";
import { avanceDentroDeEtapa } from "@/lib/embarazo/linea-de-tiempo";

type Props = {
  etapas: EtapaEmbarazo[];
  progreso: MotionValue<number>;
  /** Lleva el scroll a la etapa i (los segmentos también son botones). */
  irAEtapa: (i: number) => void;
};

/** Barra segmentada tipo "historias": un tramo por eco, se llena al scrollear. */
export function BarraEtapas({ etapas, progreso, irAEtapa }: Props) {
  return (
    <nav aria-label="Etapas del embarazo" className="mt-7">
      <ol className="flex gap-2">
        {etapas.map((e, i) => (
          <Segmento key={e.id} etapa={e} i={i} n={etapas.length} progreso={progreso} onClick={() => irAEtapa(i)} />
        ))}
      </ol>
    </nav>
  );
}

function Segmento({
  etapa,
  i,
  n,
  progreso,
  onClick,
}: {
  etapa: EtapaEmbarazo;
  i: number;
  n: number;
  progreso: MotionValue<number>;
  onClick: () => void;
}) {
  const avance = useTransform(progreso, (p) => avanceDentroDeEtapa(p, i, n));
  const opacidad = useTransform(avance, [0, 0.02], [0.55, 1]);
  const corto = etapa.rango.replace(/^Semanas\s+/i, "").replace(" a ", "–");
  return (
    <li className="flex-1">
      <button
        type="button"
        onClick={onClick}
        className="group block w-full cursor-pointer py-1 text-left"
        aria-label={`${etapa.rango}: ${etapa.estudio}`}
      >
        <span className="block h-1.5 overflow-hidden rounded-full bg-teal/15">
          <motion.span style={{ scaleX: avance }} className="block h-full origin-left rounded-full bg-teal-profundo" />
        </span>
        <motion.span
          style={{ opacity: opacidad }}
          className="mt-2 block text-[0.7rem] font-medium tracking-wide text-tinta-suave group-hover:text-teal-profundo sm:text-xs"
        >
          Sem {corto}
        </motion.span>
      </button>
    </li>
  );
}
