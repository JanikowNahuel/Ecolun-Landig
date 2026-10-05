import { ExternalLink, Quote, Star } from "lucide-react";
import { consultorio, sedePrincipal } from "@/content/consultorio";
import type { Resenia } from "@/types/contenido";
import { Aparecer } from "@/components/ui/aparecer";
import { ArcosFondo } from "@/components/ui/arcos-fondo";
import { Boton } from "@/components/ui/boton";

const formatoNota = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const formatoMes = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-05" → "mayo de 2026". */
function nombreMes(mes: string): string {
  const [anio, numero] = mes.split("-").map(Number);
  return formatoMes.format(new Date(Date.UTC(anio, numero - 1, 15)));
}

function Estrellas({ cantidad, className }: { cantidad: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${cantidad} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={
            i < Math.round(cantidad) ? "inline size-[1em] fill-menta text-menta" : "inline size-[1em] text-white/35"
          }
        />
      ))}
    </span>
  );
}

function TarjetaResenia({ resenia }: { resenia: Resenia }) {
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-pieza)] bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm">
      <Quote aria-hidden className="size-6 text-menta" />
      <blockquote className="mt-3 flex-1 text-[1.05rem] leading-relaxed text-white/95">{resenia.texto}</blockquote>
      <figcaption className="mt-5 flex items-end justify-between gap-3 text-sm">
        <span>
          <span className="block font-semibold">{resenia.autor}</span>
          {resenia.mes ? <span className="block text-xs text-white/75">{nombreMes(resenia.mes)}</span> : null}
        </span>
        <Estrellas cantidad={resenia.estrellas} className="text-sm" />
      </figcaption>
    </figure>
  );
}

/**
 * Opiniones de Google. Las reseñas se cargan a mano en content/consultorio.ts
 * (textos reales copiados de Maps). Con la lista vacía se muestra solo la
 * calificación y los links: nunca se inventan reseñas.
 */
export function Opiniones() {
  const { resenias, calificacionGoogle } = consultorio;
  return (
    <section
      id="opiniones"
      aria-labelledby="titulo-opiniones"
      className="fondo-teal relative overflow-hidden py-20 text-white sm:py-28"
    >
      <ArcosFondo />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <header>
            <p className="etiqueta text-white/80">05 — Opiniones</p>
            <h2 id="titulo-opiniones" className="mt-4 text-4xl leading-tight font-light sm:text-5xl">
              Lo que dicen <span className="font-bold">quienes ya vinieron</span>
            </h2>
          </header>
          <div className="flex items-center gap-5">
            <span className="text-7xl leading-none font-semibold tracking-tight sm:text-8xl">
              {formatoNota.format(calificacionGoogle)}
            </span>
            <span className="flex flex-col gap-1.5">
              <Estrellas cantidad={calificacionGoogle} className="text-2xl" />
              <span className="text-sm text-white/85">en Google Maps</span>
            </span>
          </div>
        </div>

        {resenias.length > 0 ? (
          <ul className={`mt-12 grid gap-5 md:grid-cols-2 ${resenias.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
            {resenias.map((r, i) => (
              <li key={`${r.autor}-${i}`}>
                <Aparecer retraso={(i % 2) * 0.06} className="h-full">
                  <TarjetaResenia resenia={r} />
                </Aparecer>
              </li>
            ))}
          </ul>
        ) : process.env.NODE_ENV === "development" ? (
          <p className="mt-10 rounded-2xl border border-dashed border-white/40 p-5 text-sm text-white/85">
            Solo en desarrollo: pegá 4–6 reseñas reales de Google en <code>src/content/consultorio.ts</code> →{" "}
            <code>resenias</code>.
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Boton
            href={sedePrincipal.mapsUrl}
            externo
            variante="claro"
            icono={<ExternalLink aria-hidden className="size-4" />}
          >
            Ver todas en Google
          </Boton>
          <Boton href={sedePrincipal.mapsUrl} externo variante="contorno-claro">
            Dejanos tu opinión
          </Boton>
        </div>
      </div>
    </section>
  );
}
