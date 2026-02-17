// Persistencia en localStorage para slots, reservas y contador de IDs

import type { Reservation, SlotsMap } from "./types";

const KEYS = {
  slots: "eliseo-gym-slots",
  reservations: "eliseo-gym-reservations",
  idCounter: "eliseo-gym-id-counter",
} as const;

// — Slots —
export function loadSlots(): SlotsMap {
  try {
    return JSON.parse(localStorage.getItem(KEYS.slots) || "{}");
  } catch {
    return {};
  }
}

export function saveSlots(slots: SlotsMap) {
  localStorage.setItem(KEYS.slots, JSON.stringify(slots));
}

// — Reservas —
export function loadReservations(): Reservation[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.reservations) || "[]");
  } catch {
    return [];
  }
}

export function saveReservations(reservations: Reservation[]) {
  localStorage.setItem(KEYS.reservations, JSON.stringify(reservations));
}

// — Contador de IDs —
export function getNextIdCounter(): number {
  const current = parseInt(localStorage.getItem(KEYS.idCounter) || "0", 10);
  const next = current + 1;
  localStorage.setItem(KEYS.idCounter, next.toString());
  return next;
}
