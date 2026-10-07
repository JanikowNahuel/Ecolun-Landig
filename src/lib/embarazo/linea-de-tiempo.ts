/**
 * Reparto del scroll entre etapas. El progreso va de 0 a 1 y cada etapa
 * ocupa una porción igual. Todo es puro para poder probarlo sin React.
 */

/** Centro de la etapa i (0-indexado). */
export function centroEtapa(i: number, n: number): number {
  return (i + 0.5) / n;
}

/**
 * Puntos de opacidad de la etapa i. Cada cambio de etapa es un fundido
 * cruzado que termina justo en el límite: la que sale y la que entra suman
 * siempre 1, así nunca queda un instante en blanco. La primera arranca
 * visible y la última no se va.
 */
export function ventanaEtapa(i: number, n: number, fundido = 0.05): { puntos: number[]; valores: number[] } {
  const inicio = i / n;
  const fin = (i + 1) / n;
  if (n === 1) return { puntos: [0, 1], valores: [1, 1] };
  if (i === 0) return { puntos: [0, fin - fundido, fin], valores: [1, 1, 0] };
  if (i === n - 1) return { puntos: [inicio - fundido, inicio, 1], valores: [0, 1, 1] };
  return { puntos: [inicio - fundido, inicio, fin - fundido, fin], valores: [0, 1, 1, 0] };
}

/** Avance de 0 a 1 dentro de la etapa i (para la barra tipo "historias"). */
export function avanceDentroDeEtapa(progreso: number, i: number, n: number): number {
  return Math.min(1, Math.max(0, progreso * n - i));
}

const limitar = (v: number) => Math.min(1, Math.max(0, v));
const suavizar = (t: number) => t * t * (3 - 2 * t);

/**
 * Barrido del haz en la etapa i: 0 → 1 durante la primera `fraccion` de su
 * tramo (ahí se "escanea" la imagen) y queda en 1 el resto (imagen quieta).
 */
export function barridoEtapa(progreso: number, i: number, n: number, fraccion = 0.45): number {
  return suavizar(limitar((progreso * n - i) / fraccion));
}

/** Etapa cuyo tramo contiene al progreso. */
export function etapaActual(progreso: number, n: number): number {
  return Math.min(n - 1, Math.max(0, Math.floor(progreso * n)));
}

/**
 * Las etapas pares barren de izquierda a derecha y las impares al revés, así
 * el transductor termina una etapa donde empieza la siguiente (sin saltos).
 */
export function sentidoEtapa(i: number): 1 | -1 {
  return i % 2 === 0 ? 1 : -1;
}

/** Inclinación del transductor en grados (positiva = el haz apunta a la derecha). */
export function inclinacionTransductor(progreso: number, n: number, maxGrados = 18): number {
  const i = etapaActual(progreso, n);
  const s = barridoEtapa(progreso, i, n);
  return sentidoEtapa(i) * (-maxGrados + 2 * maxGrados * s);
}

/**
 * Máscara cónica que revela la imagen de la etapa i desde el vértice del
 * abanico (arriba al centro). El cono cubre de 100° a 260° (0° = arriba,
 * sentido horario), o sea todo el rectángulo de la imagen. Devuelve desde
 * qué ángulo arranca la zona visible y cuántos grados abarca, y el ángulo
 * de la línea de barrido.
 */
export const CONO = { desde: 100, hasta: 260 } as const;

export function mascaraBarrido(s: number, sentido: 1 | -1): { desde: number; abarca: number; linea: number } {
  const total = CONO.hasta - CONO.desde;
  const abarca = total * limitar(s);
  if (sentido === 1) {
    // de izquierda (260°) a derecha (100°)
    return { desde: CONO.hasta - abarca, abarca, linea: CONO.hasta - abarca };
  }
  return { desde: CONO.desde, abarca, linea: CONO.desde + abarca };
}
