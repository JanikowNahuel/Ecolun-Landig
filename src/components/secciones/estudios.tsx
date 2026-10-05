import { ArrowUpRight, ClipboardList } from "lucide-react";
import { gruposEstudios, textoPreparacion } from "@/content/estudios";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { Estudio, Preparacion } from "@/types/contenido";
import { cn } from "@/lib/cn";
import { Aparecer } from "@/components/ui/aparecer";
import { ArcosFondo } from "@/components/ui/arcos-fondo";
import { EncabezadoSeccion } from "@/components/ui/encabezado-seccion";
import { Resaltado } from "@/components/ui/resaltado";

const [embarazo, generales] = gruposEstudios;

function ChipPreparacion({ tipo, sobreTeal }: { tipo: Preparacion; sobreTeal?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide",
        sobreTeal ? "bg-white/15 text-white" : "bg-aqua/60 text-tinta",
      )}
    >
      {textoPreparacion[tipo].corto}
    </span>
  );
}

function FilaEmbarazo({ estudio }: { estudio: Estudio }) {
  const Icono = estudio.icono;
  return (
    <li>
      <a
        href={linkWhatsApp(estudio.nombre)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-white/10 sm:p-4"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/35">
          <Icono aria-hidden className="size-5 text-menta" strokeWidth={1.6} />
        </span>
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold">{estudio.nombre}</span>
            <ChipPreparacion tipo={estudio.preparacion} sobreTeal />
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-white/85">{estudio.descripcion}</span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="mt-1 size-5 shrink-0 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </a>
    </li>
  );
}

function TarjetaEstudio({ estudio }: { estudio: Estudio }) {
  const Icono = estudio.icono;
  return (
    <a
      href={linkWhatsApp(estudio.nombre)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-[var(--radius-pieza)] bg-white p-5 shadow-[0_1px_0_rgba(31,70,73,0.04)] ring-1 ring-tinta/5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(31,70,73,0.45)] sm:p-6"
    >
      <span className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-full bg-aqua/45">
          <Icono aria-hidden className="size-5 text-teal-profundo" strokeWidth={1.6} />
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-5 text-teal/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-profundo"
        />
      </span>
      <span className="mt-5 font-semibold text-tinta">{estudio.nombre}</span>
      <span className="mt-1.5 flex-1 text-sm leading-relaxed text-tinta-suave">{estudio.descripcion}</span>
      <span className="mt-4">
        <ChipPreparacion tipo={estudio.preparacion} />
      </span>
    </a>
  );
}

/** Caja de contorno (recurso 6): borde menta fino y el título "rompe" la línea. */
function GuiaPreparacion() {
  const tipos = Object.keys(textoPreparacion) as Preparacion[];
  return (
    <section
      aria-labelledby="titulo-preparacion"
      className="relative mt-14 rounded-[var(--radius-pieza)] border-[1.5px] border-menta px-5 pt-9 pb-6 sm:px-8"
    >
      <h3
        id="titulo-preparacion"
        className="absolute -top-3.5 left-5 inline-flex items-center gap-2 bg-gris-claro px-3 font-semibold text-teal-profundo sm:left-8"
      >
        <ClipboardList aria-hidden className="size-5" strokeWidth={1.75} />
        ¿Cómo me preparo?
      </h3>
      <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {tipos.map((t) => (
          <div key={t}>
            <dt className="text-sm font-semibold text-tinta">{textoPreparacion[t].corto}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-tinta-suave">{textoPreparacion[t].detalle}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-xs text-tinta-suave">Si tu médico te indicó otra cosa, seguí su indicación.</p>
    </section>
  );
}

export function Estudios() {
  return (
    <section id="estudios" aria-labelledby="titulo-estudios" className="bg-gris-claro py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <EncabezadoSeccion
          id="titulo-estudios"
          numero="03"
          etiqueta="Estudios"
          suave="Hacemos"
          clave={<Resaltado>todas las ecografías</Resaltado>}
          bajada="Tocá cualquier estudio y se abre WhatsApp con el mensaje ya escrito para pedir turno."
        />

        <Aparecer className="mt-12">
          <div className="fondo-teal relative overflow-hidden rounded-[var(--radius-pieza)] p-4 text-white sm:p-6 lg:p-8">
            <ArcosFondo linea={false} />
            <div className="relative grid gap-6 lg:grid-cols-[0.75fr_2fr] lg:gap-8">
              <div className="px-3 pt-2 sm:px-4 lg:px-0">
                <h3 className="text-3xl font-semibold">{embarazo.titulo}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-white/85">
                  Las cuatro ecos clave, desde la primera hasta los controles del final.
                </p>
              </div>
              <ul className="grid gap-1 sm:grid-cols-2 sm:gap-2">
                {embarazo.estudios.map((e) => (
                  <FilaEmbarazo key={e.id} estudio={e} />
                ))}
              </ul>
            </div>
          </div>
        </Aparecer>

        <h3 className="etiqueta mt-14 text-teal-profundo">{generales.titulo}</h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {generales.estudios.map((e, i) => (
            <li key={e.id}>
              <Aparecer retraso={(i % 4) * 0.05} className="h-full">
                <TarjetaEstudio estudio={e} />
              </Aparecer>
            </li>
          ))}
        </ul>

        <GuiaPreparacion />
      </div>
    </section>
  );
}
