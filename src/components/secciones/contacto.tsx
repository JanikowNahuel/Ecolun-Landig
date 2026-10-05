import { Accessibility, Clock, MapPin, MessageCircle, Navigation, Phone, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { consultorio } from "@/content/consultorio";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { Sede } from "@/types/contenido";
import { Aparecer } from "@/components/ui/aparecer";
import { EncabezadoSeccion } from "@/components/ui/encabezado-seccion";
import { IconoInstagram } from "@/components/ui/icono-instagram";
import { Resaltado } from "@/components/ui/resaltado";

function Dato({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-aqua/45 text-teal-profundo">
        {icono}
      </span>
      <div>
        <dt className="text-sm font-semibold text-tinta">{titulo}</dt>
        <dd className="mt-0.5 leading-relaxed text-tinta-suave">{children}</dd>
      </div>
    </div>
  );
}

const enlace =
  "font-medium text-teal-profundo underline decoration-teal/30 underline-offset-4 hover:decoration-teal-profundo";

function Mapa({ sede }: { sede: Sede }) {
  const consulta = encodeURIComponent(`Ecografías ECOLUN, ${sede.direccion}, ${sede.ciudad}`);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-pieza)] bg-gris-medio ring-1 ring-tinta/5 lg:aspect-auto lg:h-full lg:min-h-[420px]">
      <iframe
        title={`Mapa: ${sede.direccion}, ${sede.ciudad}`}
        src={`https://www.google.com/maps?q=${consulta}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 grayscale-[35%]"
      />
    </div>
  );
}

export function Contacto() {
  const sede = consultorio.sedes[0];
  return (
    <section id="contacto" aria-labelledby="titulo-contacto" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <EncabezadoSeccion
          id="titulo-contacto"
          numero="06"
          etiqueta="Ubicación y contacto"
          suave="Te esperamos en"
          clave={<Resaltado>Vélez Sarsfield</Resaltado>}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <Aparecer className="h-full">
            <Mapa sede={sede} />
          </Aparecer>

          <dl className="flex flex-col gap-6">
            {consultorio.sedes.map((s) => (
              <Dato key={s.nombre} icono={<MapPin className="size-5" strokeWidth={1.75} />} titulo={s.nombre}>
                {s.direccion}, {s.ciudad}
                {s.referencia ? <span className="block text-sm">{s.referencia}</span> : null}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-1 inline-flex items-center gap-1.5 text-sm ${enlace}`}
                >
                  <Navigation aria-hidden className="size-3.5" />
                  Cómo llegar
                </a>
              </Dato>
            ))}

            <Dato icono={<MessageCircle className="size-5" strokeWidth={1.75} />} titulo="Turnos por WhatsApp">
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className={enlace}>
                Escribinos
              </a>{" "}
              y coordinamos el día y la preparación.
            </Dato>

            <Dato icono={<Phone className="size-5" strokeWidth={1.75} />} titulo="Teléfono">
              <a href={`tel:${consultorio.telefono.e164}`} className={enlace}>
                {consultorio.telefono.visible}
              </a>
            </Dato>

            <Dato icono={<Clock className="size-5" strokeWidth={1.75} />} titulo="Horarios">
              {consultorio.horarios.length > 0 ? (
                <span className="block">
                  {consultorio.horarios.map((h) => (
                    <span key={h.dias} className="block">
                      {h.dias}: {h.horas}
                    </span>
                  ))}
                </span>
              ) : (
                "Consultá los horarios por WhatsApp."
              )}
            </Dato>

            {consultorio.obrasSociales.length > 0 && (
              <Dato icono={<ShieldCheck className="size-5" strokeWidth={1.75} />} titulo="Obras sociales y prepagas">
                {consultorio.obrasSociales.join(" · ")}
              </Dato>
            )}

            <Dato icono={<IconoInstagram className="size-5" />} titulo="Instagram">
              <a href={consultorio.instagram.url} target="_blank" rel="noopener noreferrer" className={enlace}>
                @{consultorio.instagram.usuario}
              </a>
            </Dato>

            {sede.accesible && (
              <Dato icono={<Accessibility className="size-5" strokeWidth={1.75} />} titulo="Accesibilidad">
                Entrada accesible para silla de ruedas.
              </Dato>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
