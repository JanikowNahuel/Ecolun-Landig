import { cn } from "@/lib/cn";

type Props = {
  /** "claro" para fondos teal (anillos blancos); "oscuro" para fondos claros. */
  tono?: "claro" | "oscuro";
  /** El arco de línea fina; conviene apagarlo en tarjetas con mucho texto. */
  linea?: boolean;
  className?: string;
};

/**
 * Arcos de fondo (recurso 1): anillos gruesos que entran desde las esquinas,
 * más un arco de línea fina. Vienen de la "O" del logo.
 */
export function ArcosFondo({ tono = "claro", linea = true, className }: Props) {
  const trazo = tono === "claro" ? "stroke-white" : "stroke-teal";
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <circle cx="1040" cy="-60" r="430" strokeWidth="110" className={cn(trazo, "opacity-[0.09]")} />
      <circle cx="-120" cy="1080" r="380" strokeWidth="90" className={cn(trazo, "opacity-[0.07]")} />
      {linea && <circle cx="980" cy="40" r="610" strokeWidth="1.5" className={cn(trazo, "opacity-30")} />}
    </svg>
  );
}
