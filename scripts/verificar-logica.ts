/**
 * Chequeos de la lógica sin React (sin framework de tests, como en ecolun-nextjs).
 * Correr con: npm run verificar
 */
import {
  CONO,
  avanceDentroDeEtapa,
  barridoEtapa,
  centroEtapa,
  etapaActual,
  inclinacionTransductor,
  mascaraBarrido,
  sentidoEtapa,
  ventanaEtapa,
} from "../src/lib/embarazo/linea-de-tiempo.ts";

let fallas = 0;
let total = 0;

function chequear(nombre: string, ok: boolean, detalle?: unknown) {
  total++;
  if (ok) {
    console.log(`  ✓ ${nombre}`);
  } else {
    fallas++;
    console.log(`  ✗ ${nombre}`, detalle ?? "");
  }
}

const creciente = (xs: number[]) => xs.every((x, i) => i === 0 || x > xs[i - 1]);
const cerca = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;

/** Interpolación lineal por tramos, igual que useTransform. */
function interpolar(puntos: number[], valores: number[], x: number): number {
  if (x <= puntos[0]) return valores[0];
  if (x >= puntos[puntos.length - 1]) return valores[valores.length - 1];
  const i = puntos.findIndex((p) => p >= x);
  const t = (x - puntos[i - 1]) / (puntos[i] - puntos[i - 1]);
  return valores[i - 1] + t * (valores[i] - valores[i - 1]);
}

const N = 5;
const muestras = Array.from({ length: 2001 }, (_, k) => k / 2000);

console.log("Reparto del scroll entre etapas");
chequear(
  "centros de etapa en 0,1 · 0,3 · 0,5 · 0,7 · 0,9",
  [0, 1, 2, 3, 4].every((i) => cerca(centroEtapa(i, N), (2 * i + 1) / 10)),
);
for (let i = 0; i < N; i++) {
  const v = ventanaEtapa(i, N, 0.05);
  chequear(`ventana ${i}: puntos estrictamente crecientes`, creciente(v.puntos), v.puntos);
  chequear(`ventana ${i}: visible en su centro`, interpolar(v.puntos, v.valores, centroEtapa(i, N)) === 1);
}
chequear(
  "los fundidos cruzados suman siempre 1 (nunca hay textos en blanco)",
  muestras.every((p) =>
    cerca(
      [0, 1, 2, 3, 4].reduce((acc, i) => {
        const v = ventanaEtapa(i, N, 0.05);
        return acc + interpolar(v.puntos, v.valores, p);
      }, 0),
      1,
    ),
  ),
);
chequear("avance de la etapa 1 completo al llegar a 0,4", avanceDentroDeEtapa(0.4, 1, N) === 1);
chequear("etapa actual al final del scroll = la última", etapaActual(1, N) === N - 1);
chequear("etapa actual al empezar = la primera", etapaActual(0, N) === 0);

console.log("Barrido del haz");
chequear("al empezar no hay nada escaneado (pantalla 'esperando señal')", barridoEtapa(0, 0, N) === 0);
chequear(
  "cada etapa termina de escanearse antes de la mitad de su tramo",
  [0, 1, 2, 3, 4].every((i) => barridoEtapa(centroEtapa(i, N), i, N) === 1),
);
chequear(
  "el barrido nunca retrocede al avanzar el scroll",
  [0, 1, 2, 3, 4].every((i) =>
    muestras.every((p, k) => k === 0 || barridoEtapa(p, i, N) >= barridoEtapa(muestras[k - 1], i, N)),
  ),
);
chequear("las etapas alternan el sentido", sentidoEtapa(0) === 1 && sentidoEtapa(1) === -1 && sentidoEtapa(2) === 1);

const vacio = mascaraBarrido(0, 1);
const lleno = mascaraBarrido(1, 1);
const llenoInverso = mascaraBarrido(1, -1);
chequear("máscara vacía al empezar", vacio.abarca === 0);
chequear("máscara completa cubre todo el cono", lleno.abarca === CONO.hasta - CONO.desde && lleno.desde === CONO.desde);
chequear(
  "en ambos sentidos la máscara completa es la misma",
  llenoInverso.desde === lleno.desde && llenoInverso.abarca === lleno.abarca,
);
chequear("la línea de barrido arranca a la izquierda en las etapas pares", vacio.linea === CONO.hasta);
chequear("y a la derecha en las impares", mascaraBarrido(0, -1).linea === CONO.desde);

console.log("Transductor");
const saltos = muestras
  .slice(1)
  .map((p, k) => Math.abs(inclinacionTransductor(p, N) - inclinacionTransductor(muestras[k], N)));
chequear(
  "la inclinación no salta entre etapas (máx. 2,5° por paso de 0,05 %)",
  Math.max(...saltos) < 2.5,
  Math.max(...saltos),
);
chequear(
  "inclinación dentro de ±18°",
  muestras.every((p) => Math.abs(inclinacionTransductor(p, N)) <= 18 + 1e-9),
);
chequear(
  "el haz apunta hacia donde va la línea de barrido",
  [0.05, 0.25, 0.45, 0.65, 0.85].every((p) => {
    const i = etapaActual(p, N);
    const linea = mascaraBarrido(barridoEtapa(p, i, N), sentidoEtapa(i)).linea;
    const inclinacion = inclinacionTransductor(p, N);
    // línea a la derecha del centro (180°) ⇔ ángulo < 180 ⇔ inclinación positiva
    return Math.sign(180 - linea) === Math.sign(inclinacion) || Math.abs(inclinacion) < 1e-6;
  }),
);

console.log(`\n${total - fallas}/${total} chequeos OK`);
if (fallas > 0) process.exit(1);
