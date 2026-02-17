// Generador de archivos .ics para exportar al calendario

import { GYM_NAME, GYM_LOCATION } from "./config";
import type { Reservation } from "./types";

// Formatea fecha+hora al formato ICS (YYYYMMDDTHHMMSS)
function toICSDate(dateISO: string, time: string): string {
  const [y, m, d] = dateISO.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

// Suma 30 min a una hora "HH:MM"
function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

export function generateICS(r: Reservation): string {
  const start = toICSDate(r.dateISO, r.time);
  const end = toICSDate(r.dateISO, addMinutes(r.time, 30));
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${GYM_NAME}//Turnos//ES`,
    "BEGIN:VEVENT",
    `UID:${r.id}@eliseogym`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Turno - ${GYM_NAME}`,
    `DESCRIPTION:Reserva ${r.id} | Plan: ${r.plan} | Pago: Transferencia`,
    `LOCATION:${GYM_LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(r: Reservation) {
  const content = generateICS(r);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `turno-${r.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
