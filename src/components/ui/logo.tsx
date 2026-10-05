import Image from "next/image";
import logoBlanco from "@/assets/logo-ecolun-blanco.png";
import logoColor from "@/assets/logo-ecolun.png";
import { cn } from "@/lib/cn";

type Props = {
  /** "color" = original (fondos claros); "blanco" = letras blancas para fondos teal. */
  tono?: "color" | "blanco";
  /** Para el logo del header, que se ve apenas carga la página. */
  cargarYa?: boolean;
  className?: string;
};

/**
 * Logo horizontal de Ecolun (el símbolo hace de "O"). La versión blanca se
 * generó del PNG original cambiando solo el teal de las letras; el símbolo
 * queda con sus colores.
 */
export function Logo({ tono = "color", cargarYa, className }: Props) {
  return (
    <Image
      src={tono === "color" ? logoColor : logoBlanco}
      alt="Ecolun"
      sizes="180px"
      loading={cargarYa ? "eager" : "lazy"}
      className={cn("h-8 w-auto sm:h-9", className)}
    />
  );
}

/**
 * Logo del header: monta las dos versiones superpuestas y cruza la opacidad
 * cuando la barra pasa de transparente (sobre el hero teal) a blanca.
 */
export function LogoAdaptable({ sobreClaro }: { sobreClaro: boolean }) {
  return (
    <span className="relative block">
      <Logo
        tono="color"
        cargarYa
        className={cn("transition-opacity duration-300", sobreClaro ? "opacity-100" : "opacity-0")}
      />
      <span
        aria-hidden
        className={cn("absolute inset-0 transition-opacity duration-300", sobreClaro ? "opacity-0" : "opacity-100")}
      >
        <Logo tono="blanco" cargarYa />
      </span>
    </span>
  );
}
