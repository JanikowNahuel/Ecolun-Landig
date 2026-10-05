"use client";

import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribir(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

/**
 * Preferencia "reducir movimiento" del sistema. A diferencia de
 * useReducedMotion de Framer, en la hidratación devuelve lo mismo que el
 * servidor (false) y recién después el valor real, así React no encuentra
 * un HTML distinto al que llegó del servidor.
 */
export function useReducirMovimiento(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
