import fotoDoctora from "@/assets/doctora.jpg";
import type { Consultorio } from "@/types/contenido";

/**
 * ÚNICA fuente de datos del consultorio. Lo que dice "TODO" sigue pendiente;
 * el resto está confirmado por Nahuel o sale de la ficha de Google Maps (oct. 2026).
 */
export const consultorio: Consultorio = {
  nombre: "Ecolun",
  eslogan: "Ecografías en Córdoba",

  telefono: { visible: "0351 806-8577", e164: "+543518068577" },

  // Confirmado. Va con 9 (celular). Si el botón abre WhatsApp diciendo que el
  // número no es válido, es un fijo con WhatsApp Business: sacar el 9.
  whatsapp: "5493518068577",

  instagram: { usuario: "ecolun.cba", url: "https://www.instagram.com/ecolun.cba/" },

  // Solo Vélez Sarsfield (confirmado).
  sedes: [
    {
      nombre: "Consultorio Vélez Sarsfield",
      direccion: "Av. Vélez Sarsfield 3347",
      ciudad: "Córdoba",
      codigoPostal: "X5000",
      referencia: "Frente a la Plaza Eva Perón",
      lat: -31.4488095,
      lng: -64.1991458,
      mapsUrl: "https://maps.google.com/?cid=9349506406909196487",
      accesible: true,
    },
  ],

  // TODO: cargar horarios. Ej.: { dias: "Lunes a viernes", horas: "9 a 18 h" }
  horarios: [],

  // TODO: lista de obras sociales y prepagas. Vacío = no se muestra el bloque.
  obrasSociales: [],

  calificacionGoogle: 5.0,

  // Reseñas reales de Google Maps (capturas de oct. 2026). Solo se agregaron
  // los espacios que faltaban después de las comas; el texto es el original.
  // Para sumar más: nombre de pila + inicial, y el mes aproximado.
  resenias: [
    {
      autor: "Javier A.",
      estrellas: 5,
      mes: "2026-05",
      texto:
        "Con mi pareja fuimos a realizar la ecografía de embarazo de 12 semanas. La doctora es muy amable, nos explicó todo lo que iba haciendo y nos sacó todas nuestras dudas. El lugar es muy lindo. Lo recomendamos.",
    },
    {
      autor: "Claudia T.",
      estrellas: 5,
      mes: "2026-05",
      texto:
        "Muy buena la atención, se tomó todo el tiempo para explicar lo que se observaba en la pantalla, muy simpática en el primer momento. La recomiendo.",
    },
    {
      autor: "Sofia C.",
      estrellas: 5,
      mes: "2026-07",
      texto:
        "Muy buena atención, muy amables y atentos. Me atendieron al instante y me entregaron en el acto los resultados 😁",
    },
    {
      autor: "Micaela C.",
      estrellas: 5,
      mes: "2026-09",
      texto: "Una genia súper amable 🫶",
    },
  ],

  doctora: {
    nombre: "Dra. Daniela Luna",
    titulo: "Especialista en diagnóstico por imágenes",
    matricula: null, // TODO (opcional): "M.P. 00000"
    bio: [
      "Hace cada estudio con tiempo para explicarte lo que se ve en la pantalla, sin apuro y en un lenguaje claro.",
      "Acompaña cada etapa del embarazo, desde la primera eco hasta los controles del final.",
    ],
    destacados: [
      "Todas las ecografías, en un solo lugar",
      "Te explicamos cada imagen, sin apuro",
      "Consultorio con entrada accesible",
    ],
    foto: fotoDoctora,
    fotoAlt: "Dra. Daniela Luna en el consultorio de Ecolun, junto al ecógrafo",
  },
};

export const sedePrincipal = consultorio.sedes[0];
