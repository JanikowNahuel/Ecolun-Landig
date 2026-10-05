/**
 * Chequeos de la lógica sin React (sin framework de tests, como en ecolun-nextjs).
 * Correr con: npm run verificar
 */
import {
  avanceDentroDeEtapa,
  centroEtapa,
  formatearSemana,
  semanasClave,
  ventanaEtapa,
} from "../src/lib/embarazo/linea-de-tiempo.ts";
import { caminoAbanico, caminoOndaDoppler, puntosEnCurva } from "../src/lib/embarazo/abanico.ts";

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

/** Interpolación lineal por tramos, igual que useTransform. */
function interpolar(puntos: number[], valores: number[], x: number): number {
  if (x <= puntos[0]) return valores[0];
  if (x >= puntos[puntos.length - 1]) return valores[valores.length - 1];
  const i = puntos.findIndex((p) => p >= x);
  const t = (x - puntos[i - 1]) / (puntos[i] - puntos[i - 1]);
  return valores[i - 1] + t * (valores[i] - valores[i - 1]);
}

console.log("Línea de tiempo del embarazo");
const N = 4;
chequear(
  "centros de etapa en 1/8, 3/8, 5/8, 7/8",
  [0, 1, 2, 3].every((i) => centroEtapa(i, N) === (2 * i + 1) / 8),
);

for (let i = 0; i < N; i++) {
  const v = ventanaEtapa(i, N, 0.05);
  chequear(`ventana ${i}: puntos estrictamente crecientes`, creciente(v.puntos), v.puntos);
  chequear(`ventana ${i}: visible en su centro`, interpolar(v.puntos, v.valores, centroEtapa(i, N)) === 1);
}

let sumaOk = true;
let nuncaVacio = true;
for (let k = 0; k <= 1000; k++) {
  const p = k / 1000;
  const suma = [0, 1, 2, 3].reduce((acc, i) => {
    const v = ventanaEtapa(i, N, 0.05);
    return acc + interpolar(v.puntos, v.valores, p);
  }, 0);
  if (Math.abs(suma - 1) > 1e-9) sumaOk = false;
  if (suma < 0.99) nuncaVacio = false;
}
chequear("los fundidos cruzados suman siempre 1 (nunca hay pantalla en blanco)", sumaOk && nuncaVacio);

chequear("avance dentro de la etapa 0 al empezar", avanceDentroDeEtapa(0, 0, N) === 0);
chequear("avance completo de la etapa 1 al llegar a 0,5", avanceDentroDeEtapa(0.5, 1, N) === 1);
chequear("avance de la etapa 3 todavía en 0 a mitad de camino", avanceDentroDeEtapa(0.5, 3, N) === 0);

const s = semanasClave([7, 12, 22, 32], N);
chequear("semanas clave: puntos crecientes", creciente(s.puntos), s.puntos);
chequear("semana en el centro de la etapa 2 = 22", interpolar(s.puntos, s.valores, centroEtapa(2, N)) === 22);
chequear("formato SEM 07", formatearSemana(6.6) === "SEM 07");

console.log("Geometría del abanico");
chequear("el abanico es un camino cerrado", caminoAbanico().trim().endsWith("Z"));
chequear("el abanico no tiene NaN", !caminoAbanico().includes("NaN"));
const onda = caminoOndaDoppler(400);
chequear("la onda del doppler cubre todo el ancho", onda.includes("L 438 0"), onda.slice(-30));
const vertebras = puntosEnCurva({ x: 0, y: 0 }, { x: 5, y: 10 }, { x: 10, y: 0 }, 5);
chequear(
  "las vértebras arrancan y terminan en los extremos",
  vertebras[0].x === 0 && vertebras[4].x === 10 && vertebras.length === 5,
);

console.log(`\n${total - fallas}/${total} chequeos OK`);
if (fallas > 0) process.exit(1);
