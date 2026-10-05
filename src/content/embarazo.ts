import type { EtapaEmbarazo } from "@/types/contenido";

/**
 * Etapas del recorrido con scroll. El orden importa: la animación reparte
 * el scroll en partes iguales, una por etapa.
 */
export const etapasEmbarazo: EtapaEmbarazo[] = [
  {
    id: "primera",
    semana: 7,
    rango: "Semanas 6 a 10",
    estudio: "Obstétrica del primer trimestre",
    titulo: "La primera eco",
    texto: "Confirmamos que el embarazo esté dentro del útero, vemos el latido y calculamos de cuántas semanas estás.",
    tamanio: "Del tamaño de una frambuesa",
    medida: "LCN 10 mm · FCF 150 lpm",
  },
  {
    id: "nucal",
    semana: 12,
    rango: "Semanas 11 a 14",
    estudio: "Translucencia nucal",
    titulo: "Un control con fecha justa",
    texto:
      "Medimos un pliegue en la nuca del bebé que, junto con otros datos, ayuda a estimar el riesgo de algunas alteraciones cromosómicas. Se hace solo en esta ventana: no la dejes pasar.",
    tamanio: "Del tamaño de un limón",
    medida: "TN 1,6 mm",
  },
  {
    id: "morfologica",
    semana: 22,
    rango: "Semanas 20 a 24",
    estudio: "Ecografía morfológica",
    titulo: "La eco más completa",
    texto:
      "Revisamos órgano por órgano: cerebro, corazón, columna, riñones, manos y pies. Si querés, también te contamos si es nena o nene.",
    tamanio: "Del largo de una banana",
    medida: "DBP 54 mm",
  },
  {
    id: "crecimiento",
    semana: 32,
    rango: "Semanas 28 a 36",
    estudio: "Doppler y control de crecimiento",
    titulo: "Llegando al final",
    texto:
      "Controlamos el peso estimado, la posición, el líquido amniótico y cómo le llega la sangre al bebé a través de la placenta.",
    tamanio: "Del tamaño de un ananá",
    medida: "PFE 1.850 g · Doppler",
  },
];
