// Configuración editable del sistema de turnos

export const GYM_NAME = "Eliseo Gym";

// Yo dejo el WhatsApp en formato internacional (Argentina: 54 + 9 + número)
export const WHATSAPP_NUMBER = "5492995777823";

export const EMAIL = "eliseogym@email.com";

export const TRANSFER_ALIAS = "eliseo.gym.mp";
export const TRANSFER_CBU = "0000003100037508325117";
export const TRANSFER_OWNER = "Eliseo Gym";
export const CURRENCY = "ARS";
export const QR_IMAGE_PATH = "/qr-transferencia.png";

// Yo dejo la dirección real del gym
export const GYM_LOCATION = "Otto Max Neuman 3680, Neuquén Capital";

// Yo centralizo redes para usarlas en Footer/Contacto
export const INSTAGRAM_HANDLE = "eliseo.gym";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

// (Opcional) Link a Google Maps, lo dejo listo por si querés
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Otto%20Max%20Neuman%203680%2C%20Neuqu%C3%A9n%20Capital";


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
