"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { enlacesNavegacion } from "@/content/navegacion";
import { linkWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { LogoAdaptable } from "@/components/ui/logo";

/**
 * Barra superior: transparente sobre el hero teal y blanca con desenfoque
 * apenas se scrollea. En mobile, menú desplegable.
 */
export function Encabezado() {
  const { scrollY } = useScroll();
  const [solido, setSolido] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setSolido(y > 40));

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [abierto]);

  const claro = solido || abierto;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        claro ? "bg-white/90 shadow-[0_1px_0_rgba(31,70,73,0.08)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        <a href="#inicio" aria-label="Ecolun, ir al inicio" className="rounded-lg">
          <LogoAdaptable sobreClaro={claro} />
        </a>

        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {enlacesNavegacion.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    claro
                      ? "text-tinta-suave hover:bg-gris-claro hover:text-teal-profundo"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden min-h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors sm:inline-flex",
              claro ? "bg-teal-profundo text-white hover:bg-tinta" : "bg-white text-teal-profundo hover:bg-aqua",
            )}
          >
            <MessageCircle aria-hidden className="size-4" />
            Pedí tu turno
          </a>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-mobile"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors lg:hidden",
              claro ? "text-teal-profundo hover:bg-gris-claro" : "text-white hover:bg-white/10",
            )}
          >
            {abierto ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.nav
            id="menu-mobile"
            aria-label="Secciones"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-tinta/5 bg-white px-4 pb-6 lg:hidden"
          >
            <ul className="flex flex-col py-2">
              {enlacesNavegacion.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className="block rounded-xl px-3 py-3.5 text-lg text-tinta hover:bg-gris-claro"
                  >
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-profundo font-medium text-white"
            >
              <MessageCircle aria-hidden className="size-4.5" />
              Pedí tu turno por WhatsApp
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
