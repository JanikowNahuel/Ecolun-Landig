import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Píldora con borde (recurso 4): fechas y etiquetas, mayúsculas espaciadas, sin relleno. */
export function Pildora({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("etiqueta inline-flex items-center gap-2 rounded-full border px-4 py-1.5", className)}>
      {children}
    </span>
  );
}
