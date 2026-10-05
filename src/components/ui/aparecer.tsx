"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  retraso?: number;
  className?: string;
};

/**
 * Entrada suave al aparecer en pantalla. Con "reducir movimiento" el
 * MotionConfig del layout anula el desplazamiento y deja solo el fundido.
 */
export function Aparecer({ children, retraso = 0, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay: retraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
