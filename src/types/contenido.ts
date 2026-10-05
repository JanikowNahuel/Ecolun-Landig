import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";

export type Sede = {
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  referencia?: string;
  lat: number;
  lng: number;
  /** Link a la ficha de Google Maps (para "ver en Google" y reseñas). */
  mapsUrl: string;
  accesible: boolean;
};

export type Horario = {
  dias: string;
  horas: string;
};

/**
 * Reseña copiada de Google Maps. Solo texto real: nunca inventar ni editar
 * el sentido. Se muestra nombre de pila + inicial del apellido.
 */
export type Resenia = {
  autor: string;
  texto: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  /**
   * Mes aproximado ("2026-05"), calculado desde el "hace X semanas" de Google.
   * No se guarda el "hace X semanas" porque en una página fija queda viejo.
   */
  mes?: string;
};

export type Doctora = {
  nombre: string;
  titulo: string;
  matricula: string | null;
  bio: string[];
  /** Tres frases cortas que acompañan la bio. */
  destacados: string[];
  /** Import estático desde src/assets. Si es null se muestra el ícono. */
  foto: StaticImageData | null;
  /** Texto alternativo de la foto. */
  fotoAlt: string;
};

export type Consultorio = {
  nombre: string;
  eslogan: string;
  telefono: { visible: string; e164: string };
  /** Número para wa.me: código de país + área + número, sin "+", sin 0 ni 15. */
  whatsapp: string;
  instagram: { usuario: string; url: string };
  sedes: Sede[];
  /** Vacío = se muestra "Consultá horarios por WhatsApp". */
  horarios: Horario[];
  obrasSociales: string[];
  calificacionGoogle: number;
  resenias: Resenia[];
  doctora: Doctora;
};

export type Preparacion = "sin-preparacion" | "ayuno" | "vejiga-llena" | "vejiga-vacia" | "segun-semana";

export type Estudio = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  preparacion: Preparacion;
};

export type GrupoEstudios = {
  id: string;
  titulo: string;
  estudios: Estudio[];
};

export type EtapaEmbarazo = {
  id: string;
  /** Semana que muestra el monitor del ecógrafo en esta etapa. */
  semana: number;
  rango: string;
  estudio: string;
  titulo: string;
  texto: string;
  tamanio: string;
  /** Medición que aparece en el monitor (valores típicos de esa semana). */
  medida: string;
};
