// Generación de ID, packId y mensaje prearmado

import { GYM_NAME, WHATSAPP_NUMBER, EMAIL } from "./config";
import { getNextIdCounter } from "./storage";
import type { Reservation } from "./types";

// Yo genero ID con formato ELISEO-YYYY-###### (secuencia)
export function generateReservationId(): string {
  const year = new Date().getFullYear();
  const counter = getNextIdCounter();
  return `ELISEO-${year}-${counter.toString().padStart(6, "0")}`;
}

// Yo genero un packId simple para agrupar turnos del mismo plan (no es secuencial)
export function generatePackId(): string {
  const year = new Date().getFullYear();
  const rnd = Math.floor(100000 + Math.random() * 900000);
  return `PACK-${year}-${rnd}`;
}

// Yo armo un mensaje prolijo para 1 reserva o para un pack (varios turnos)
export function buildMessage(r: Reservation | Reservation[]): string {
  const list = Array.isArray(r) ? r : [r];
  const first = list[0];

  const titlePlan = first.plan;
  const packLine = Array.isArray(r)
    ? `Pack: ${first.packId || "—"} (${list.length} turnos)`
    : `Reserva: ${first.id}`;

  const turnos = list
    .map((t, i) => {
      const n = Array.isArray(r) ? `${i + 1}) ` : "";
      return `${n}${t.dayLabel} (${t.dateISO}) — ${t.time}`;
    })
    .join("\n");

  return [
    `Hola! Reservé en ${GYM_NAME}.`,
    ``,
    `${packLine}`,
    `Plan: ${titlePlan}`,
    ``,
    `Turno/s:`,
    `${turnos}`,
    ``,
    `Pago: Transferencia (adjunto comprobante).`,
    ``,
    `Gracias.`,
    ``,
    `Enviado desde la web de ${GYM_NAME}.`,
  ].join("\n");
}

// Yo armo el link a WhatsApp con el mensaje ya cargado
export function buildWhatsAppUrl(r: Reservation | Reservation[]): string {
  const msg = encodeURIComponent(buildMessage(r));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// Yo armo el mailto con asunto + cuerpo
export function buildMailtoUrl(r: Reservation | Reservation[]): string {
  const list = Array.isArray(r) ? r : [r];
  const first = list[0];
  const subject = encodeURIComponent(
    Array.isArray(r)
      ? `Reserva pack ${first.packId || ""} — ${GYM_NAME}`
      : `Reserva ${first.id} — ${GYM_NAME}`
  );
  const body = encodeURIComponent(buildMessage(r));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}
