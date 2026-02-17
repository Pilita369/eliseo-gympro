// Generación de ID y mensaje prearmado

import { GYM_NAME, WHATSAPP_NUMBER, EMAIL } from "./config";
import { getNextIdCounter } from "./storage";
import type { Reservation } from "./types";

// Genera ID con formato ELISEO-YYYY-######
export function generateReservationId(): string {
  const year = new Date().getFullYear();
  const counter = getNextIdCounter();
  return `ELISEO-${year}-${counter.toString().padStart(6, "0")}`;
}

// Mensaje prearmado elegante
export function buildMessage(r: Reservation): string {
  return [
    `Hola! Reservé un turno en ${GYM_NAME}.`,
    ``,
    `Reserva: ${r.id}`,
    `Plan: ${r.plan}`,
    `Día: ${r.dayLabel} (${r.dateISO})`,
    `Hora: ${r.time}`,
    `Pago: Transferencia (adjunto comprobante).`,
    ``,
    `Gracias.`,
    ``,
    `Enviado desde la web de ${GYM_NAME}.`,
  ].join("\n");
}

// URL de WhatsApp
export function buildWhatsAppUrl(r: Reservation): string {
  const msg = encodeURIComponent(buildMessage(r));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// URL de mailto
export function buildMailtoUrl(r: Reservation): string {
  const subject = encodeURIComponent(`Reserva ${r.id} — ${GYM_NAME}`);
  const body = encodeURIComponent(buildMessage(r));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}
