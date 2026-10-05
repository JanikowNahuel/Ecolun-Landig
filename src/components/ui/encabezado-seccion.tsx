import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** id del <h2>, para el aria-labelledby de la sección. */
  id?: string;
  numero: string;
  etiqueta: string;
  /** Parte suave del titular (Light 300). */
  suave: ReactNode;
  /** Palabra clave (Bold, resaltada). */
  clave: ReactNode;
  bajada?: ReactNode;
  centrado?: boolean;
  className?: string;
};

/**
 * Encabezado de sección con la fórmula de la guía: etiqueta "01 — …",
 * titular que mezcla Light arriba y Bold resaltado, y un párrafo corto.
 */
export function EncabezadoSeccion({ id, numero, etiqueta, suave, clave, bajada, centrado, className }: Props) {
  return (
    <header className={cn("max-w-2xl", centrado && "mx-auto text-center", className)}>
      <p className="etiqueta text-teal-profundo">
        {numero} — {etiqueta}
      </p>
      <h2
        id={id}
        className="mt-4 text-[2.15rem] leading-[1.15] font-light tracking-tight text-teal-profundo sm:text-5xl"
      >
        <span className="block">{suave}</span>
        <span className="mt-2 block">{clave}</span>
      </h2>
      {bajada ? <p className="mt-5 text-base leading-relaxed text-tinta-suave sm:text-lg">{bajada}</p> : null}
    </header>
  );
}
