/**
 * Geometría del abanico (imagen sectorial del ecógrafo) en un viewBox de
 * 400 × 420. El vértice queda arriba, donde apoya el transductor.
 */
export const VIEWBOX = { ancho: 400, alto: 420 } as const;

export const ABANICO = {
  vertice: { x: 200, y: 26 },
  radioExterno: 340,
  radioInterno: 22,
  semiApertura: 36, // grados a cada lado de la vertical
} as const;

/** Centro de la bolsa / del bebé dentro del abanico. */
export const CENTRO_ESCENA = { x: 200, y: 218 } as const;

function punto(radio: number, grados: number) {
  const rad = (grados * Math.PI) / 180;
  return {
    x: ABANICO.vertice.x + radio * Math.sin(rad),
    y: ABANICO.vertice.y + radio * Math.cos(rad),
  };
}

const r = (n: number) => Math.round(n * 100) / 100;

export function caminoAbanico(): string {
  const { radioExterno: R, radioInterno: ri, semiApertura: a } = ABANICO;
  const izqInt = punto(ri, -a);
  const izqExt = punto(R, -a);
  const derExt = punto(R, a);
  const derInt = punto(ri, a);
  return [
    `M ${r(izqInt.x)} ${r(izqInt.y)}`,
    `L ${r(izqExt.x)} ${r(izqExt.y)}`,
    `A ${R} ${R} 0 0 0 ${r(derExt.x)} ${r(derExt.y)}`,
    `L ${r(derInt.x)} ${r(derInt.y)}`,
    `A ${ri} ${ri} 0 0 1 ${r(izqInt.x)} ${r(izqInt.y)}`,
    "Z",
  ].join(" ");
}

/** Onda del doppler de arteria umbilical: subida rápida y bajada lenta. */
export function caminoOndaDoppler(ancho: number, periodo = 38, alto = 28): string {
  const partes = [`M 0 0`];
  for (let x = 0; x < ancho + periodo; x += periodo) {
    partes.push(
      `L ${x} ${-alto * 0.3}`,
      `L ${x + 4} ${-alto}`,
      `Q ${x + 11} ${-alto * 0.42} ${x + periodo} ${-alto * 0.3}`,
    );
  }
  partes.push(`L ${ancho + periodo} 0 Z`);
  return partes.join(" ");
}

/** Puntos sobre una curva cuadrática (para las vértebras de la columna). */
export function puntosEnCurva(
  desde: { x: number; y: number },
  control: { x: number; y: number },
  hasta: { x: number; y: number },
  cantidad: number,
): Array<{ x: number; y: number }> {
  return Array.from({ length: cantidad }, (_, i) => {
    const t = cantidad === 1 ? 0 : i / (cantidad - 1);
    const u = 1 - t;
    return {
      x: r(u * u * desde.x + 2 * u * t * control.x + t * t * hasta.x),
      y: r(u * u * desde.y + 2 * u * t * control.y + t * t * hasta.y),
    };
  });
}
