import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** "menta" = recurso 2 de la guía (rectángulo redondeado girado -2°).
   *  "banda" = recurso 3 (banda teal recta, para fondos claros). */
  variante?: "menta" | "banda";
  className?: string;
};

/**
 * Resaltado de la palabra clave. El texto va en tinta (no blanco) sobre menta:
 * blanco sobre #90C3A2 da 2:1 y no se lee bien.
 */
export function Resaltado({ children, variante = "menta", className }: Props) {
  return (
    <span
      className={cn(
        "relative inline-block whitespace-nowrap px-[0.28em] pb-[0.06em] font-bold",
        variante === "menta" && "-rotate-2 rounded-[0.3em] bg-menta text-tinta",
        variante === "banda" && "-rotate-2 bg-teal-profundo text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
