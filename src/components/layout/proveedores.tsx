"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Con "reducir movimiento" activo en el sistema, Framer deja solo los fundidos. */
export function Proveedores({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
