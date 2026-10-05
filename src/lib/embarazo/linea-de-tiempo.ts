/**
 * Reparto del scroll entre etapas. El progreso va de 0 a 1 y cada etapa
 * ocupa una porción igual. Todo es puro para poder probarlo sin React.
 */

export const CANTIDAD_ETAPAS = 4;

/** Centro de la etapa i (0-indexado). */
export function centroEtapa(i: number, n = CANTIDAD_ETAPAS): number {
  return (i + 0.5) / n;
}

/**
 * Puntos de opacidad de la etapa i. Cada cambio de etapa es un fundido
 * cruzado que termina justo en el límite: la que sale y la que entra suman
 * siempre 1, así nunca queda un instante en blanco. La primera arranca
 * visible y la última no se va.
 */
export function ventanaEtapa(i: number, n = CANTIDAD_ETAPAS, fundido = 0.05): { puntos: number[]; valores: number[] } {
  const inicio = i / n;
  const fin = (i + 1) / n;
  if (n === 1) return { puntos: [0, 1], valores: [1, 1] };
  if (i === 0) return { puntos: [0, fin - fundido, fin], valores: [1, 1, 0] };
  if (i === n - 1) return { puntos: [inicio - fundido, inicio, 1], valores: [0, 1, 1] };
  return { puntos: [inicio - fundido, inicio, fin - fundido, fin], valores: [0, 1, 1, 0] };
}

/** Avance de 0 a 1 dentro de la etapa i (para la barra tipo "historias"). */
export function avanceDentroDeEtapa(progreso: number, i: number, n = CANTIDAD_ETAPAS): number {
  return Math.min(1, Math.max(0, progreso * n - i));
}

/** Semana que muestra el monitor: se queda quieta en cada etapa y avanza entre etapas. */
export function semanasClave(semanas: number[], n = CANTIDAD_ETAPAS): { puntos: number[]; valores: number[] } {
  const puntos = [0];
  const valores = [semanas[0] - 1];
  semanas.forEach((s, i) => {
    puntos.push(centroEtapa(i, n));
    valores.push(s);
  });
  puntos.push(1);
  valores.push(semanas[semanas.length - 1] + 1);
  return { puntos, valores };
}

export function formatearSemana(v: number): string {
  return `SEM ${String(Math.round(v)).padStart(2, "0")}`;
}
