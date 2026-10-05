"use client";

import { type MotionValue, motion, useMotionTemplate, useTransform } from "framer-motion";
import { useId, useRef } from "react";
import { etapasEmbarazo } from "@/content/embarazo";
import { useAtributoSvg } from "@/hooks/use-atributo-svg";
import { useVentanasEtapas } from "@/hooks/use-ventanas-etapas";
import { CENTRO_ESCENA, VIEWBOX, caminoAbanico, caminoOndaDoppler } from "@/lib/embarazo/abanico";
import { centroEtapa, formatearSemana, semanasClave } from "@/lib/embarazo/linea-de-tiempo";
import { cn } from "@/lib/cn";
import { CAMINO_CORDON, COLOR, DefinicionesEco, Embrion, FetoAvanzado, FetoTemprano, Medicion } from "./figuras";

const CAMINO_ABANICO = caminoAbanico();
const CAMINO_ONDA = caminoOndaDoppler(VIEWBOX.ancho);
const N = etapasEmbarazo.length;
const CENTROS = etapasEmbarazo.map((_, i) => centroEtapa(i, N));
const SEMANAS = semanasClave(
  etapasEmbarazo.map((e) => e.semana),
  N,
);

type Props = {
  /** 0 → 1 a lo largo de todo el embarazo. */
  progreso: MotionValue<number>;
  /** Sin textos del monitor (para la polaroid del hero). */
  compacto?: boolean;
  className?: string;
};

/**
 * Pantalla del ecógrafo. Todo se deriva de un único `progreso`: la bolsa
 * crece, el embrión pasa a feto, aparecen la placenta, los calipers de cada
 * estudio y, al final, el doppler.
 */
export function PantallaEcografo({ progreso, compacto = false, className }: Props) {
  const p = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { x: cx, y: cy } = CENTRO_ESCENA;

  // Bolsa / cavidad amniótica
  const sacoRx = useTransform(progreso, CENTROS, [50, 118, 176, 240]);
  const sacoRy = useTransform(progreso, CENTROS, [38, 78, 120, 172]);
  const placentaRx = useTransform(sacoRx, (v) => v - 9);
  const placentaRy = useTransform(sacoRy, (v) => v - 9);
  const opPlacenta = useTransform(progreso, [0.5, 0.6], [0, 1]);

  // Embrión → feto temprano → feto avanzado
  const opEmbrion = useTransform(progreso, [0, 0.2, 0.28], [1, 1, 0]);
  const escEmbrion = useTransform(progreso, [0, CENTROS[0], 0.28], [1.25, 1.45, 2.1]);

  const opTemprano = useTransform(progreso, [0.2, 0.28, 0.45, 0.53], [0, 1, 1, 0]);
  const escTemprano = useTransform(progreso, [0.2, CENTROS[1], 0.53], [0.55, 0.95, 1.14]);

  const opAvanzado = useTransform(progreso, [0.45, 0.53], [0, 1]);
  const escAvanzado = useTransform(progreso, [0.45, CENTROS[2], CENTROS[3], 1], [0.84, 1, 1.42, 1.48]);
  const dxAvanzado = useTransform(progreso, [CENTROS[2], CENTROS[3]], [0, 26]);
  const dyAvanzado = useTransform(progreso, [CENTROS[2], CENTROS[3]], [0, 16]);

  const tEmbrion = useMotionTemplate`translate(${cx} ${cy}) scale(${escEmbrion})`;
  const tTemprano = useMotionTemplate`translate(${cx} ${cy}) scale(${escTemprano})`;
  const tAvanzado = useMotionTemplate`translate(${cx} ${cy}) translate(${dxAvanzado} ${dyAvanzado}) scale(${escAvanzado})`;

  // Calipers y doppler, uno por etapa
  const opMedidas = useVentanasEtapas(progreso, N, 0.06);

  const semana = useTransform(progreso, SEMANAS.puntos, SEMANAS.valores);
  const textoSemana = useTransform(semana, formatearSemana);

  const refSaco = useRef<SVGEllipseElement>(null);
  const refPlacenta = useRef<SVGEllipseElement>(null);
  const refEmbrion = useRef<SVGGElement>(null);
  const refTemprano = useRef<SVGGElement>(null);
  const refAvanzado = useRef<SVGGElement>(null);
  useAtributoSvg(refSaco, "rx", sacoRx);
  useAtributoSvg(refSaco, "ry", sacoRy);
  useAtributoSvg(refPlacenta, "rx", placentaRx);
  useAtributoSvg(refPlacenta, "ry", placentaRy);
  useAtributoSvg(refEmbrion, "transform", tEmbrion);
  useAtributoSvg(refTemprano, "transform", tTemprano);
  useAtributoSvg(refAvanzado, "transform", tAvanzado);

  return (
    <div
      className={cn(
        "relative aspect-[400/420] w-full overflow-hidden rounded-[1.75rem] bg-[#081718] shadow-[0_30px_80px_-30px_rgba(14,36,38,0.7)] ring-1 ring-white/5",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Imagen de ecografía animada: el bebé crece de la semana 6 a la 32."
      >
        <DefinicionesEco prefijo={p} />
        <clipPath id={`${p}-abanico`}>
          <path d={CAMINO_ABANICO} />
        </clipPath>

        <path d={CAMINO_ABANICO} fill={`url(#${p}-fondo)`} />

        <g clipPath={`url(#${p}-abanico)`}>
          {/* bolsa */}
          <ellipse
            ref={refSaco}
            cx={cx}
            cy={cy}
            rx={50}
            ry={38}
            fill={COLOR.liquido}
            stroke="#bfe3df"
            strokeWidth={3}
            strokeOpacity={0.55}
            filter={`url(#${p}-brillo)`}
          />
          {/* placenta: banda gruesa en la parte de arriba de la bolsa */}
          <motion.ellipse
            ref={refPlacenta}
            cx={cx}
            cy={cy}
            rx={150}
            ry={100}
            fill="none"
            stroke="#8fb8b4"
            strokeWidth={16}
            pathLength={100}
            strokeDasharray="34 66"
            strokeDashoffset={-58}
            filter={`url(#${p}-suave)`}
            style={{ opacity: opPlacenta }}
          />

          <motion.g ref={refEmbrion} style={{ opacity: opEmbrion }}>
            <Embrion prefijo={p} />
            <motion.g style={{ opacity: opMedidas[0] }}>
              <Medicion desde={{ x: -21, y: 10 }} hasta={{ x: 15, y: 9 }} />
            </motion.g>
          </motion.g>

          <motion.g ref={refTemprano} style={{ opacity: opTemprano }}>
            <FetoTemprano prefijo={p} />
            <motion.g style={{ opacity: opMedidas[1] }}>
              <Medicion desde={{ x: -24, y: 22.5 }} hasta={{ x: -23, y: 31 }} />
            </motion.g>
          </motion.g>

          <motion.g ref={refAvanzado} style={{ opacity: opAvanzado }}>
            <FetoAvanzado prefijo={p} />
            <motion.g style={{ opacity: opMedidas[2] }}>
              <Medicion desde={{ x: -72, y: -34 }} hasta={{ x: -72, y: 26 }} />
            </motion.g>
            {/* caja de doppler color sobre el cordón */}
            <motion.g style={{ opacity: opMedidas[3] }}>
              <rect
                x={6}
                y={-104}
                width={46}
                height={50}
                fill="none"
                stroke="#b0e4e5"
                strokeWidth={1.2}
                strokeDasharray="3 2"
              />
              <clipPath id={`${p}-caja`}>
                <rect x={6} y={-104} width={46} height={50} />
              </clipPath>
              <path
                d={CAMINO_CORDON}
                fill="none"
                stroke="#90c3a2"
                strokeWidth={6}
                strokeLinecap="round"
                clipPath={`url(#${p}-caja)`}
              />
            </motion.g>
          </motion.g>
        </g>

        {!compacto && (
          <>
            {/* escala de profundidad */}
            <g fill="#6dacb1" opacity={0.55}>
              {Array.from({ length: 9 }, (_, i) => (
                <rect key={i} x={i % 2 ? 386 : 382} y={46 + i * 26} width={i % 2 ? 4 : 8} height={1.5} />
              ))}
            </g>
            {/* onda del doppler */}
            <motion.g style={{ opacity: opMedidas[N - 1] }}>
              <clipPath id={`${p}-onda`}>
                <rect x={18} y={372} width={364} height={40} />
              </clipPath>
              <line x1={18} y1={408} x2={382} y2={408} stroke="#6dacb1" strokeWidth={1} opacity={0.6} />
              <g clipPath={`url(#${p}-onda)`}>
                {/* el translate va en un <g> aparte: la animación CSS pisa el transform del path */}
                <g transform="translate(18 408)">
                  <path
                    d={CAMINO_ONDA}
                    fill="#d8f4f2"
                    opacity={0.8}
                    className="animate-onda motion-reduce:animate-none"
                  />
                </g>
              </g>
            </motion.g>
          </>
        )}
      </svg>

      {/* grano del ecógrafo: capa fija aparte para no recalcular el filtro en cada cuadro */}
      <svg
        aria-hidden
        viewBox={`0 0 ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-overlay will-change-transform"
      >
        <filter id={`${p}-grano`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={4} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.9 -0.62" />
        </filter>
        <clipPath id={`${p}-abanico-grano`}>
          <path d={CAMINO_ABANICO} />
        </clipPath>
        <rect
          width={VIEWBOX.ancho}
          height={VIEWBOX.alto}
          filter={`url(#${p}-grano)`}
          clipPath={`url(#${p}-abanico-grano)`}
        />
      </svg>

      {!compacto && (
        <div className="pointer-events-none absolute inset-0 p-4 text-aqua sm:p-5">
          <div className="flex items-start justify-between">
            <span className="etiqueta text-[0.6rem] text-aqua/70">Ecolun · OB</span>
            <motion.span className="text-lg font-semibold tabular-nums tracking-wide text-white sm:text-xl">
              {textoSemana}
            </motion.span>
          </div>
          <div className="absolute bottom-[13%] left-4 sm:left-5">
            {etapasEmbarazo.map((e, i) => (
              <MedidaMonitor key={e.id} texto={e.medida} visible={opMedidas[i]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Medición del monitor. Igual que los textos: sale una y recién después entra la otra. */
function MedidaMonitor({ texto, visible }: { texto: string; visible: MotionValue<number> }) {
  const opacidad = useTransform(visible, [0, 0.5, 1], [0, 0, 1]);
  return (
    <motion.span
      style={{ opacity: opacidad }}
      className="absolute bottom-0 left-0 text-[0.7rem] font-medium tracking-wide whitespace-nowrap text-menta sm:text-xs"
    >
      {texto}
    </motion.span>
  );
}
