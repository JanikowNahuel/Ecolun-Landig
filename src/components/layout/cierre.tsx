import { MessageCircle } from "lucide-react";
import { consultorio, sedePrincipal } from "@/content/consultorio";
import { creditosImagenes } from "@/content/creditos-imagenes";
import { enlacesNavegacion } from "@/content/navegacion";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Boton } from "@/components/ui/boton";
import { Logo } from "@/components/ui/logo";

/** Casquete inferior (recurso 5, la firma más reconocible de la marca) + pie. */
export function Cierre() {
  return (
    <>
      <section aria-labelledby="titulo-cierre" className="relative overflow-hidden bg-white pt-16">
        <div className="relative mx-auto h-[24rem] max-w-[100vw] sm:h-[26rem]">
          <div
            aria-hidden
            className="absolute top-0 left-1/2 h-[48rem] w-[190%] -translate-x-1/2 rounded-[50%] bg-menta sm:w-[140%] lg:w-[110%]"
          />
          <div className="relative flex h-full flex-col items-center justify-center px-4 pt-6 text-center">
            <span className="grid size-14 place-items-center rounded-full border-2 border-white">
              <MessageCircle aria-hidden className="size-7 text-white" strokeWidth={1.5} />
            </span>
            <h2 id="titulo-cierre" className="mt-5 text-4xl leading-tight text-tinta sm:text-5xl">
              <span className="block font-bold">Escribinos</span>
              <span className="block font-light">y reservá tu turno</span>
            </h2>
            <Boton href={linkWhatsApp()} externo className="mt-7">
              Abrir WhatsApp
            </Boton>
          </div>
        </div>
      </section>

      <footer className="bg-teal-profundo text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
          <div>
            <Logo tono="blanco" className="h-9" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
              {consultorio.eslogan}. {sedePrincipal.direccion}, {sedePrincipal.ciudad}.
            </p>
          </div>
          <nav aria-label="Secciones (pie)">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {enlacesNavegacion.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className="text-white/85 hover:text-white">
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <a href={`tel:${consultorio.telefono.e164}`} className="hover:text-white">
                {consultorio.telefono.visible}
              </a>
            </li>
            <li>
              <a
                href={consultorio.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                @{consultorio.instagram.usuario}
              </a>
            </li>
          </ul>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto max-w-6xl space-y-3 px-4 pt-5 pb-24 text-xs leading-relaxed text-white/70 sm:px-6 sm:pb-5 lg:px-8">
            <p>
              © {new Date().getFullYear()} {consultorio.nombre}. La información de este sitio es orientativa y no
              reemplaza la indicación de tu médico.
            </p>
            <details className="group">
              <summary className="cursor-pointer list-none text-white/80 hover:text-white">
                Créditos de las ecografías <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </summary>
              <ul className="mt-2 space-y-1">
                {creditosImagenes.map((c) => (
                  <li key={c.id}>
                    {c.descripcion}:{" "}
                    <a
                      href={c.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      {c.autor}
                    </a>
                    ,{" "}
                    <a
                      href={c.licenciaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      {c.licencia}
                    </a>
                    {c.cambios !== "ninguno" ? ` (${c.cambios})` : ""}. Wikimedia Commons.
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </footer>
    </>
  );
}
