"use client";

import { type MotionValue, interpolate, motionValue } from "framer-motion";
import { useEffect, useMemo } from "react";
import { ventanaEtapa } from "@/lib/embarazo/linea-de-tiempo";

/**
 * Una opacidad (0–1) por etapa, derivada del progreso del scroll.
 * Se arma con un solo efecto para no llamar a useTransform dentro de un map.
 */
export function useVentanasEtapas(progreso: MotionValue<number>, n: number, fundido = 0.05): MotionValue<number>[] {
  const ventanas = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const { puntos, valores } = ventanaEtapa(i, n, fundido);
        const calcular = interpolate(puntos, valores, { clamp: true });
        return { calcular, valor: motionValue(calcular(progreso.get())) };
      }),
    [progreso, n, fundido],
  );

  useEffect(() => {
    const actualizar = (p: number) => ventanas.forEach((v) => v.valor.set(v.calcular(p)));
    actualizar(progreso.get());
    return progreso.on("change", actualizar);
  }, [progreso, ventanas]);

  return ventanas.map((v) => v.valor);
}
