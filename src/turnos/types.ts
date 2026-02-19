// Tipos del sistema de reservas

export type Plan = "2xSemana" | "3xSemana" | "TodaLaSemana" | "Online";

export type ReservationStatus =
  | "Pendiente de pago"
  | "Comprobante enviado"
  | "Confirmado"
  | "Cancelado";

export type Reservation = {
  id: string;
  plan: Plan;
  dayLabel: string;
  dateISO: string;
  time: string;
  qty: number;
  status: ReservationStatus;
  createdAt: string;
  paymentMethod: "Transferencia";
  note?: string;
  amountSuggested?: number;

  // Yo agrupo reservas cuando son packs (2x/3x/full)
  packId?: string;
  packTotal?: number;
  packIndex?: number;
};

// Clave de slot: "2026-02-17_08:00"
export type SlotKey = string;

export type SlotState = {
  occupied: number;
  blocked: boolean;
};

export type SlotsMap = Record<SlotKey, SlotState>;
