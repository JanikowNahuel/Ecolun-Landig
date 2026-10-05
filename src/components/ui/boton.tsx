import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "primario" | "claro" | "contorno" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario: "bg-teal-profundo text-white hover:bg-tinta",
  claro: "bg-white text-teal-profundo hover:bg-aqua",
  contorno: "border border-teal-profundo/40 text-teal-profundo hover:border-teal-profundo hover:bg-white",
  "contorno-claro": "border border-white/60 text-white hover:border-white hover:bg-white/10",
};

type Props = ComponentProps<"a"> & {
  variante?: Variante;
  icono?: ReactNode;
  externo?: boolean;
};

/** CTA en píldora (recurso 8 de la guía). Siempre es un link: WhatsApp, ancla o mapa. */
export function Boton({ variante = "primario", icono, externo, className, children, ...props }: Props) {
  return (
    <a
      {...props}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-200",
        estilos[variante],
        className,
      )}
    >
      {icono}
      <span>{children}</span>
    </a>
  );
}
