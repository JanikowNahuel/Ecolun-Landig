"use client";

import { type MotionValue, useMotionValueEvent } from "framer-motion";
import { type RefObject, useLayoutEffect } from "react";

/**
 * Escribe un MotionValue directo en un atributo SVG (transform, rx, ry…),
 * sin re-render de React. Framer Motion maneja bien opacity en SVG, pero sus
 * atajos de transform calculan el origen sobre la caja del elemento y acá
 * necesitamos escalar desde un punto fijo del abanico.
 */
export function useAtributoSvg<T extends SVGElement>(
  ref: RefObject<T | null>,
  atributo: string,
  valor: MotionValue<string> | MotionValue<number>,
) {
  useLayoutEffect(() => {
    ref.current?.setAttribute(atributo, String(valor.get()));
  }, [ref, atributo, valor]);

  useMotionValueEvent(valor as MotionValue<string | number>, "change", (v) => {
    ref.current?.setAttribute(atributo, String(v));
  });
}
