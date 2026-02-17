// Configuración editable del sistema de turnos

export const GYM_NAME = "Eliseo Gym";
export const WHATSAPP_NUMBER = "549XXXXXXXXXX";
export const EMAIL = "eliseogym@email.com";
export const TRANSFER_ALIAS = "eliseogym.mp";
export const TRANSFER_CBU = "0000000000000000000000";
export const TRANSFER_OWNER = "Eliseo Gym";
export const CURRENCY = "ARS";
export const QR_IMAGE_PATH = "/qr-transferencia.png";
export const GYM_LOCATION = "Eliseo Gym — Dirección editable";

// Días hábiles
export const DAYS_CONFIG = [
  { key: "lunes", label: "Lunes", weekday: 1 },
  { key: "martes", label: "Martes", weekday: 2 },
  { key: "miercoles", label: "Miércoles", weekday: 3 },
  { key: "jueves", label: "Jueves", weekday: 4 },
  { key: "viernes", label: "Viernes", weekday: 5 },
] as const;


// Yo genero horarios cada 1 hora (07:00 a 14:00).
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 14; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

export const TIME_SLOTS = generateTimeSlots();
export const MAX_PER_SLOT = 2;

// Yo defino los precios oficiales de cada plan (editables cuando quiera).
export const DEFAULT_PRICE_BY_PLAN: Record<string, number> = {
  "2xSemana": 70000,
  "3xSemana": 100000,
  "TodaLaSemana": 120000,
  "Online": 50000,
};


// Planes disponibles
export const PLANS = [
  { id: "2xSemana" as const, label: "2 veces por semana", short: "2x" },
  { id: "3xSemana" as const, label: "3 veces por semana", short: "3x" },
  { id: "TodaLaSemana" as const, label: "Toda la semana", short: "Full" },
  { id: "Online" as const, label: "Online", short: "Online" },
];
