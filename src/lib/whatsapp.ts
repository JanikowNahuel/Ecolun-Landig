import { consultorio } from "@/content/consultorio";

const SALUDO = "¡Hola! Quería pedir un turno";

/**
 * Link de WhatsApp con el mensaje ya escrito. Si se pasa un estudio,
 * el mensaje lo nombra para que recepción no tenga que preguntar.
 */
export function linkWhatsApp(estudio?: string): string {
  const mensaje = estudio ? `${SALUDO} para una ecografía ${estudio.toLowerCase()}.` : `${SALUDO}.`;
  return `https://wa.me/${consultorio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
