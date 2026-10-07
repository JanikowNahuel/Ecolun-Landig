import eco08 from "@/assets/ecos/eco-08-semanas.jpg";
import eco12 from "@/assets/ecos/eco-12-semanas.jpg";
import eco20 from "@/assets/ecos/eco-20-semanas.jpg";
import eco3d from "@/assets/ecos/eco-3d.jpg";
import ecoDoppler from "@/assets/ecos/eco-doppler.jpg";
import type { EtapaEmbarazo } from "@/types/contenido";

/**
 * Etapas del escaneo con scroll. El orden importa: la animación reparte el
 * scroll en partes iguales, una por etapa.
 *
 * Las ecografías son reales, de Wikimedia Commons (ver creditos-imagenes.ts).
 * TODO: reemplazarlas por ecografías de la Dra. Luna, con permiso de las
 * pacientes y sin nombre, DNI ni fecha en pantalla. Al cambiarlas, revisar
 * `medida` (tiene que coincidir con lo que muestra la imagen) y `foco`.
 */
export const etapasEmbarazo: EtapaEmbarazo[] = [
  {
    id: "primera",
    rango: "Semanas 6 a 10",
    estudio: "Obstétrica del primer trimestre",
    titulo: "La primera eco",
    texto: "Confirmamos que el embarazo esté dentro del útero, vemos el latido y calculamos de cuántas semanas estás.",
    imagen: eco08,
    imagenAlt: "Ecografía real de un embrión de 8 semanas dentro del saco gestacional, con la medición de largo.",
    credito: "eco-08",
    hud: "SEM 08",
    medida: "LCN 16,7 mm · 8s 1d",
    foco: [8, 18, 42, 34],
  },
  {
    id: "nucal",
    rango: "Semanas 11 a 14",
    estudio: "Translucencia nucal",
    titulo: "Un control con fecha justa",
    texto:
      "Medimos un pliegue en la nuca del bebé que, junto con otros datos, ayuda a estimar el riesgo de algunas alteraciones cromosómicas. Se hace solo en esta ventana: no la dejes pasar.",
    imagen: eco12,
    imagenAlt: "Ecografía real de un feto de 12 semanas de perfil, en corte sagital.",
    credito: "eco-12",
    hud: "SEM 12",
    medida: "LCN 65,1 mm · corte sagital",
    foco: [10, 33, 80, 56],
  },
  {
    id: "morfologica",
    rango: "Semanas 20 a 24",
    estudio: "Ecografía morfológica",
    titulo: "La eco más completa",
    texto:
      "Revisamos órgano por órgano: cerebro, corazón, columna, riñones, manos y pies. Si querés, también te contamos si es nena o nene.",
    imagen: eco20,
    imagenAlt: "Ecografía real del perfil de un feto de 20 semanas.",
    credito: "eco-20",
    hud: "SEM 20",
    medida: "Perfil fetal · 20s 5d",
    foco: [28, 14, 54, 36],
  },
  {
    id: "doppler",
    rango: "Semanas 28 a 36",
    estudio: "Doppler y control de crecimiento",
    titulo: "Llegando al final",
    texto:
      "Controlamos el peso estimado, la posición, el líquido amniótico y cómo le llega la sangre al bebé a través de la placenta.",
    imagen: ecoDoppler,
    imagenAlt: "Ecografía doppler real del cordón umbilical, con el flujo en color y la curva de velocidad abajo.",
    credito: "eco-doppler",
    hud: "DOPPLER",
    medida: "Arteria umbilical · Doppler color",
    foco: [22, 20, 24, 26],
  },
  {
    // TODO: confirmar con la Dra. Luna que hace ecografías 3D/4D (en su foto
    // se ve una en el monitor). Si no, borrar esta etapa.
    id: "4d",
    rango: "Semanas 24 a 30",
    estudio: "Ecografía 3D / 4D",
    titulo: "Conocé su carita",
    texto:
      "Con la eco en 3D y 4D ves los rasgos y los gestos del bebé en volumen y en movimiento. Es el momento ideal para venir en familia.",
    imagen: eco3d,
    imagenAlt: "Ecografía 3D real de la cara de un bebé con la mano cerca de la boca.",
    credito: "eco-3d",
    hud: "3D · 4D",
    medida: "Render de superficie",
    foco: [20, 26, 58, 54],
  },
];
