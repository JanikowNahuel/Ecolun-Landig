import { Check, Stethoscope } from "lucide-react";
import Image from "next/image";
import { consultorio } from "@/content/consultorio";
import { Aparecer } from "@/components/ui/aparecer";
import { ArcosFondo } from "@/components/ui/arcos-fondo";
import { EncabezadoSeccion } from "@/components/ui/encabezado-seccion";
import { Resaltado } from "@/components/ui/resaltado";

const { doctora } = consultorio;

/** Marco en arco (la "O" del logo cortada a la mitad). Sin foto, muestra un ícono. */
function RetratoDoctora() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* contorno menta desplazado, como los arcos de la marca */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 marco-arco border-2 border-menta sm:translate-x-4 sm:translate-y-4"
      />
      <MarcoRetrato />
    </div>
  );
}

function MarcoRetrato() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden marco-arco bg-teal">
      {doctora.foto ? (
        <Image
          src={doctora.foto}
          alt={doctora.fotoAlt}
          fill
          placeholder="blur"
          sizes="(min-width: 640px) 384px, 90vw"
          className="object-cover"
        />
      ) : (
        <div className="fondo-teal absolute inset-0 grid place-items-center">
          <ArcosFondo />
          <div className="relative grid size-40 place-items-center rounded-full border-[10px] border-white/25">
            <Stethoscope aria-hidden className="size-16 text-white" strokeWidth={1.25} />
          </div>
        </div>
      )}
    </div>
  );
}

export function Doctora() {
  return (
    <section id="doctora" aria-labelledby="titulo-doctora" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:gap-20 lg:px-8">
        <Aparecer>
          <RetratoDoctora />
        </Aparecer>
        <div>
          <EncabezadoSeccion
            id="titulo-doctora"
            numero="04"
            etiqueta="Quién te atiende"
            suave="Te atiende la"
            clave={<Resaltado>{doctora.nombre}</Resaltado>}
          />
          <p className="mt-5 text-sm font-medium tracking-wide text-teal-profundo">
            {doctora.titulo}
            {doctora.matricula ? ` · ${doctora.matricula}` : null}
          </p>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-tinta-suave sm:text-lg">
            {doctora.bio.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </div>
          <ul className="mt-8 space-y-3">
            {doctora.destacados.map((d) => (
              <li key={d} className="flex items-center gap-3 text-tinta">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-menta/50">
                  <Check aria-hidden className="size-4 text-tinta" strokeWidth={2.25} />
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
