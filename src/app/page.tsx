import { RecorridoEmbarazo } from "@/components/embarazo/recorrido-embarazo";
import { Hero } from "@/components/hero/hero";
import { Cierre } from "@/components/layout/cierre";
import { Encabezado } from "@/components/layout/encabezado";
import { WhatsAppFlotante } from "@/components/layout/whatsapp-flotante";
import { Contacto } from "@/components/secciones/contacto";
import { Doctora } from "@/components/secciones/doctora";
import { Estudios } from "@/components/secciones/estudios";
import { Opiniones } from "@/components/secciones/opiniones";
import { jsonLdConsultorio, serializarJsonLd } from "@/lib/seo";

/**
 * Landing de Ecolun. Server Component: todo el HTML sale renderizado
 * (bueno para Google); solo el header, la animación del embarazo, la
 * polaroid, las entradas suaves y el botón flotante hidratan en el cliente.
 */
export default function Inicio() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLdConsultorio()) }} />
      <a
        href="#embarazo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Saltar al contenido
      </a>
      <Encabezado />
      <main>
        <Hero />
        <RecorridoEmbarazo />
        <Estudios />
        <Doctora />
        <Opiniones />
        <Contacto />
      </main>
      <Cierre />
      <WhatsAppFlotante />
    </>
  );
}
