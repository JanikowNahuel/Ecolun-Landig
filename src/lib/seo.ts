import { consultorio } from "@/content/consultorio";
import { gruposEstudios } from "@/content/estudios";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecolun-web.vercel.app";

export const SEO = {
  titulo: "Ecolun · Ecografías en Córdoba | Dra. Luna",
  descripcion:
    "Ecografías de embarazo (translucencia nucal, morfológica, doppler) y todas las ecografías generales en Av. Vélez Sarsfield 3347, Córdoba. Turnos por WhatsApp.",
};

/**
 * Datos estructurados para Google (ficha local). No incluye aggregateRating:
 * Google no acepta calificaciones propias de un negocio sobre sí mismo.
 */
export function jsonLdConsultorio() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${consultorio.nombre} · ${consultorio.eslogan}`,
    url: SITE_URL,
    telephone: consultorio.telefono.e164,
    sameAs: [consultorio.instagram.url],
    image: `${SITE_URL}/opengraph-image`,
    employee: {
      "@type": "Person",
      name: consultorio.doctora.nombre.replace(/^Dra\.\s*/, ""),
      honorificPrefix: "Dra.",
      jobTitle: consultorio.doctora.titulo,
    },
    medicalSpecialty: ["Obstetric", "Gynecologic", "Radiography"],
    availableService: gruposEstudios.flatMap((g) =>
      g.estudios.map((e) => ({ "@type": "MedicalTest", name: `Ecografía ${e.nombre.toLowerCase()}` })),
    ),
    location: consultorio.sedes.map((s) => ({
      "@type": "Place",
      name: s.nombre,
      address: {
        "@type": "PostalAddress",
        streetAddress: s.direccion,
        addressLocality: s.ciudad,
        addressRegion: "Córdoba",
        postalCode: s.codigoPostal,
        addressCountry: "AR",
      },
      geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
      hasMap: s.mapsUrl,
    })),
  };
}

/** Serializa sin abrir la puerta a cerrar el <script> desde los datos. */
export function serializarJsonLd(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
