"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { linkWhatsApp } from "@/lib/whatsapp";

/** true mientras el tramo fijo del embarazo ocupa toda la pantalla (tiene su propio CTA y su barra abajo). */
function enRecorridoEmbarazo(): boolean {
  const tramo = document.querySelector<HTMLElement>("[data-recorrido-embarazo]");
  if (!tramo) return false;
  const r = tramo.getBoundingClientRect();
  return r.top <= 1 && r.bottom >= window.innerHeight - 1;
}

/** Botón fijo de turnos. Aparece después del hero, que ya tiene su propio CTA. */
export function WhatsAppFlotante() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 0.8 && !enRecorridoEmbarazo()));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir turno por WhatsApp"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="fixed right-4 bottom-4 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-teal-profundo pr-5 pl-4 text-white shadow-[0_14px_34px_-10px_rgba(31,70,73,0.65)] ring-4 ring-white/70 hover:bg-tinta sm:right-6 sm:bottom-6"
        >
          <MessageCircle aria-hidden className="size-6" strokeWidth={1.75} />
          <span className="text-sm font-medium">Turnos</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
