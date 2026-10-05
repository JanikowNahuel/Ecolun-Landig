import {
  Activity,
  Baby,
  Bean,
  Droplets,
  Flower2,
  HeartPulse,
  Mars,
  PersonStanding,
  Ribbon,
  ScanLine,
  Sparkles,
  Waves,
} from "lucide-react";
import type { GrupoEstudios, Preparacion } from "@/types/contenido";

// TODO: revisar la lista con la Dra. Luna (agregar o sacar estudios).
export const gruposEstudios: GrupoEstudios[] = [
  {
    id: "embarazo",
    titulo: "Embarazo",
    estudios: [
      {
        id: "obstetrica-temprana",
        nombre: "Obstétrica del primer trimestre",
        descripcion: "Confirma el embarazo, el latido y las semanas de gestación.",
        icono: HeartPulse,
        preparacion: "segun-semana",
      },
      {
        id: "translucencia-nucal",
        nombre: "Translucencia nucal",
        descripcion: "Screening del primer trimestre, entre las semanas 11 y 14.",
        icono: ScanLine,
        preparacion: "sin-preparacion",
      },
      {
        id: "morfologica",
        nombre: "Morfológica",
        descripcion: "Revisión completa de la anatomía del bebé, semanas 20 a 24.",
        icono: Baby,
        preparacion: "sin-preparacion",
      },
      {
        id: "doppler-obstetrico",
        nombre: "Doppler obstétrico y crecimiento",
        descripcion: "Peso estimado, líquido, placenta y flujo sanguíneo del bebé.",
        icono: Waves,
        preparacion: "sin-preparacion",
      },
    ],
  },
  {
    id: "generales",
    titulo: "Todas las demás",
    estudios: [
      {
        id: "ginecologica",
        nombre: "Ginecológica",
        descripcion: "Útero y ovarios, por vía abdominal o transvaginal.",
        icono: Flower2,
        preparacion: "vejiga-llena",
      },
      {
        id: "transvaginal",
        nombre: "Transvaginal",
        descripcion: "Mayor detalle de útero, endometrio y ovarios.",
        icono: Sparkles,
        preparacion: "vejiga-vacia",
      },
      {
        id: "mamaria",
        nombre: "Mamaria",
        descripcion: "Complemento de la mamografía o control de nódulos.",
        icono: Ribbon,
        preparacion: "sin-preparacion",
      },
      {
        id: "abdominal",
        nombre: "Abdominal",
        descripcion: "Hígado, vesícula, páncreas, bazo y riñones.",
        icono: Activity,
        preparacion: "ayuno",
      },
      {
        id: "renal",
        nombre: "Renal y vesical",
        descripcion: "Riñones, vías urinarias y vejiga.",
        icono: Bean,
        preparacion: "vejiga-llena",
      },
      {
        id: "tiroides",
        nombre: "Tiroides y cuello",
        descripcion: "Glándula tiroides, nódulos y ganglios del cuello.",
        icono: Droplets,
        preparacion: "sin-preparacion",
      },
      {
        id: "partes-blandas",
        nombre: "Partes blandas y músculo",
        descripcion: "Bultos, quistes, hernias, músculos y tendones.",
        icono: PersonStanding,
        preparacion: "sin-preparacion",
      },
      {
        id: "testicular-prostatica",
        nombre: "Testicular y prostática",
        descripcion: "Testículos, próstata y vejiga.",
        icono: Mars,
        preparacion: "vejiga-llena",
      },
    ],
  },
];

export const textoPreparacion: Record<Preparacion, { corto: string; detalle: string }> = {
  "sin-preparacion": {
    corto: "Sin preparación",
    detalle: "Vení como estés.",
  },
  ayuno: {
    corto: "Ayuno de 6 h",
    detalle: "No comer en las 6 horas previas. Podés tomar un poco de agua.",
  },
  "vejiga-llena": {
    corto: "Vejiga llena",
    detalle: "Tomá 1 litro de agua una hora antes y no vayas al baño hasta el estudio.",
  },
  "vejiga-vacia": {
    corto: "Vejiga vacía",
    detalle: "Andá al baño justo antes de entrar.",
  },
  "segun-semana": {
    corto: "Según la semana",
    detalle: "Al principio del embarazo puede pedirse vejiga llena. Consultanos al reservar.",
  },
};
