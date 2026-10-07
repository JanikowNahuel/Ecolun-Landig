import type { CreditoImagen } from "@/types/contenido";

const CC_BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/deed.es";
const CC_BY_4 = "https://creativecommons.org/licenses/by/4.0/deed.es";

/**
 * Ecografías de Wikimedia Commons. Las licencias CC piden nombrar al autor,
 * la licencia y los cambios; las BY-SA, además, que la versión modificada
 * se comparta con la misma licencia. Se muestran en el pie de la página.
 */
export const creditosImagenes: CreditoImagen[] = [
  {
    id: "eco-08",
    descripcion: "Ecografía de 8 semanas",
    autor: "Ragesoss",
    licencia: "CC BY-SA 3.0",
    licenciaUrl: CC_BY_SA_3,
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Ultrasound_of_human_fetus,_8_weeks_and_1_day.jpg",
    cambios: "recortada, en escala de grises",
  },
  {
    id: "eco-12",
    descripcion: "Ecografía de 12 semanas",
    autor: "Dr. Wolfgang Moroder",
    licencia: "CC BY-SA 3.0",
    licenciaUrl: CC_BY_SA_3,
    fuenteUrl:
      "https://commons.wikimedia.org/wiki/File:CRL_Crown_rump_length_12_weeks_ecografia_Dr._Wolfgang_Moroder.jpg",
    cambios: "recortada, en escala de grises",
  },
  {
    id: "eco-20",
    descripcion: "Ecografía de 20 semanas",
    autor: "Goleisureintl",
    licencia: "CC BY 4.0",
    licenciaUrl: CC_BY_4,
    fuenteUrl:
      "https://commons.wikimedia.org/wiki/File:Obstetric_ultrasound_scan_monitor_showing_20-week_human_fetus_profile_in_Navi_Mumbai_2015.jpg",
    cambios: "recortada a la imagen del monitor, en escala de grises",
  },
  {
    id: "eco-doppler",
    descripcion: "Doppler de arteria umbilical",
    autor: "Nevit Dilmen",
    licencia: "CC BY-SA 3.0",
    licenciaUrl: CC_BY_SA_3,
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Ultrasound_Scan_ND_0111140446_1411140.png",
    cambios: "recortada",
  },
  {
    id: "eco-3d",
    descripcion: "Ecografía 3D",
    autor: "Madcapslaugh",
    licencia: "Dominio público",
    licenciaUrl: "https://commons.wikimedia.org/wiki/File:4dsonogram.jpg",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:4dsonogram.jpg",
    cambios: "ninguno",
  },
];
