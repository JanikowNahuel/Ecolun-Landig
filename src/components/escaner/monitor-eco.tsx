"use client";

import { type MotionValue, motion, useMotionTemplate, useTransform } from "framer-motion";
import Image from "next/image";
import type { EtapaEmbarazo } from "@/types/contenido";
import { barridoEtapa, etapaActual, mascaraBarrido, sentidoEtapa } from "@/lib/embarazo/linea-de-tiempo";
import { cn } from "@/lib/cn";

type Props = {
  etapas: EtapaEmbarazo[];
  progreso: MotionValue<number>;
  /** Opacidad 0–1 de cada etapa (para los textos del monitor). */
  visibles: MotionValue<number>[];
  className?: string;
};

/** Vértice del abanico: arriba al centro, un poco por encima del borde. */
const VERTICE = "50% -4%";

/**
 * Pantalla del ecógrafo. Cada etapa es una capa con su ecografía real que se
 * revela con una máscara cónica que barre desde el vértice, como el haz del
 * transductor. Las capas anteriores quedan debajo, así la nueva "pinta"
 * sobre la vieja. Todo sale de `progreso`, sin animaciones sueltas.
 */
export function MonitorEco({ etapas, progreso, visibles, className }: Props) {
  const n = etapas.length;

  const anguloLinea = useTransform(progreso, (p) => {
    const i = etapaActual(p, n);
    return mascaraBarrido(barridoEtapa(p, i, n), sentidoEtapa(i)).linea - 180;
  });
  const opacidadLinea = useTransform(progreso, (p) => {
    const s = barridoEtapa(p, etapaActual(p, n), n);
    return s <= 0.002 || s >= 0.998 ? 0 : Math.min(1, Math.min(s, 1 - s) * 12);
  });
  const opacidadEspera = useTransform(progreso, (p) => 1 - Math.min(1, barridoEtapa(p, 0, n) * 5));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {/* barra superior */}
      <div className="flex h-7 items-center justify-between gap-2 border-b border-white/10 px-3 font-mono text-[0.6rem] tracking-wider text-aqua/75 sm:px-4 sm:text-[0.66rem]">
        <span className="truncate">ECOLUN · C1-6 · 3,5 MHz · OB</span>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-menta">
          <span className="size-1.5 rounded-full bg-menta motion-safe:animate-pulse" />
          EN VIVO
        </span>
      </div>

      <div className="relative flex">
        {/* escala de profundidad */}
        <div aria-hidden className="flex w-6 shrink-0 flex-col justify-between py-2 pl-1.5 sm:w-8">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="flex items-center gap-1 font-mono text-[0.5rem] text-aqua/45">
              <span className={cn("h-px bg-aqua/50", i % 2 ? "w-1.5" : "w-2.5")} />
              {i % 2 ? "" : i * 2}
            </span>
          ))}
        </div>

        {/* imagen */}
        <div className="relative aspect-[4/3] flex-1 overflow-hidden">
          {etapas.map((e, i) => (
            <CapaEco key={e.id} etapa={e} i={i} n={n} progreso={progreso} visible={visibles[i]} />
          ))}

          {/* textura de pantalla: líneas y viñeta */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] mix-blend-multiply"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_0%,transparent_55%,rgba(0,0,0,0.75)_100%)]"
          />

          {/* línea de barrido */}
          <motion.div
            aria-hidden
            style={{ rotate: anguloLinea, opacity: opacidadLinea }}
            className="pointer-events-none absolute top-[-4%] left-1/2 h-[150%] w-[3px] origin-top -translate-x-1/2 bg-gradient-to-b from-white via-aqua/80 to-transparent shadow-[0_0_18px_4px_rgba(176,228,229,0.55)]"
          />

          {/* antes del primer barrido */}
          <motion.p
            style={{ opacity: opacidadEspera }}
            className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-xs tracking-[0.3em] text-aqua/60"
          >
            ESPERANDO SEÑAL…
          </motion.p>
        </div>

        {/* barra de grises */}
        <div aria-hidden className="flex w-5 shrink-0 items-center justify-center py-3 sm:w-7">
          <span className="h-[70%] w-1.5 rounded-full bg-gradient-to-b from-white via-neutral-500 to-black ring-1 ring-white/10" />
        </div>
      </div>

      {/* barra inferior */}
      <div className="relative flex h-8 items-center justify-between gap-2 border-t border-white/10 px-3 font-mono text-[0.6rem] text-aqua/75 sm:h-9 sm:px-4 sm:text-[0.68rem]">
        <span className="relative h-full flex-1">
          {etapas.map((e, i) => (
            <TextoMonitor key={e.id} visible={visibles[i]} className="text-menta">
              {e.medida}
            </TextoMonitor>
          ))}
        </span>
        <span className="relative h-full w-[5.5rem] text-right font-semibold text-white sm:w-24">
          {etapas.map((e, i) => (
            <TextoMonitor key={e.id} visible={visibles[i]} className="justify-end text-[0.75rem] sm:text-sm">
              {e.hud}
            </TextoMonitor>
          ))}
        </span>
      </div>
    </div>
  );
}

function CapaEco({
  etapa,
  i,
  n,
  progreso,
  visible,
}: {
  etapa: EtapaEmbarazo;
  i: number;
  n: number;
  progreso: MotionValue<number>;
  visible: MotionValue<number>;
}) {
  const sentido = sentidoEtapa(i);
  const barrido = useTransform(progreso, (p) => barridoEtapa(p, i, n));
  const desde = useTransform(barrido, (s) => mascaraBarrido(s, sentido).desde);
  const abarca = useTransform(barrido, (s) => mascaraBarrido(s, sentido).abarca);
  const mascara = useMotionTemplate`conic-gradient(from ${desde}deg at ${VERTICE}, #000 0deg ${abarca}deg, transparent ${abarca}deg)`;
  // el recuadro de foco aparece cuando terminó el barrido y la etapa está en pantalla
  const opacidadFoco = useTransform([barrido, visible], ([s, v]: number[]) => Math.max(0, (s - 0.85) / 0.15) * v);
  const [x, y, w, h] = etapa.foco;

  return (
    <motion.div className="absolute inset-0" style={{ maskImage: mascara, WebkitMaskImage: mascara, zIndex: i }}>
      <Image
        src={etapa.imagen}
        alt={etapa.imagenAlt}
        fill
        sizes="(min-width: 1024px) 460px, 90vw"
        className="object-cover"
        placeholder="blur"
      />
      <motion.svg
        aria-hidden
        style={{ opacity: opacidadFoco }}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="#90c3a2" strokeWidth={1.4} vectorEffect="non-scaling-stroke">
          <Esquinas x={x} y={y} w={w} h={h} />
        </g>
      </motion.svg>
    </motion.div>
  );
}

/** Cuatro esquinas de un recuadro (zona de interés), en coordenadas 0–100. */
function Esquinas({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const lx = Math.min(5, w / 4);
  const ly = Math.min(6, h / 4);
  const d = [
    `M ${x} ${y + ly} V ${y} H ${x + lx}`,
    `M ${x + w - lx} ${y} H ${x + w} V ${y + ly}`,
    `M ${x + w} ${y + h - ly} V ${y + h} H ${x + w - lx}`,
    `M ${x + lx} ${y + h} H ${x} V ${y + h - ly}`,
  ].join(" ");
  return <path d={d} vectorEffect="non-scaling-stroke" />;
}

function TextoMonitor({
  visible,
  className,
  children,
}: {
  visible: MotionValue<number>;
  className?: string;
  children: React.ReactNode;
}) {
  const opacidad = useTransform(visible, [0, 0.5, 1], [0, 0, 1]);
  return (
    <motion.span
      style={{ opacity: opacidad }}
      className={cn("absolute inset-0 flex items-center truncate whitespace-nowrap", className)}
    >
      {children}
    </motion.span>
  );
}
