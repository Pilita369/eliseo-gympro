// Panel derecho con resumen de la reserva y botones de acción

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck, Lock, ShieldCheck } from "lucide-react";
import { PLANS, DEFAULT_PRICE_BY_PLAN, CURRENCY, MAX_PER_SLOT } from "@/turnos/config";
import type { Plan, SlotState } from "@/turnos/types";

type Props = {
  selectedPlan: Plan | "";
  selectedDay: { label: string; dateISO: string } | null;
  selectedTime: string | null;
  slotState: SlotState;
  adminMode: boolean;
  onToggleAdmin: (v: boolean) => void;
  onReserve: () => void;
  onBlock: () => void;
};

export default function ReservationSummary({
  selectedPlan, selectedDay, selectedTime, slotState,
  adminMode, onToggleAdmin, onReserve, onBlock,
}: Props) {
  const planLabel = PLANS.find((p) => p.id === selectedPlan)?.label || "—";
  const price = selectedPlan ? DEFAULT_PRICE_BY_PLAN[selectedPlan] : undefined;
  const available = MAX_PER_SLOT - slotState.occupied;
  const canReserve = selectedPlan && selectedDay && selectedTime && available > 0 && !slotState.blocked;
  const canBlock = selectedPlan && selectedDay && selectedTime && slotState.occupied === 0 && !slotState.blocked;

  return (
    <div className="glass-card p-5 space-y-5 sticky top-24">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <CalendarCheck size={20} className="text-primary" />
        Resumen de reserva
      </h3>

      <div className="space-y-3 text-sm">
        <Row label="Plan" value={planLabel} />
        <Row label="Día" value={selectedDay ? `${selectedDay.label} (${selectedDay.dateISO})` : "—"} />
        <Row label="Hora" value={selectedTime || "—"} />
        <Row label="Cupos disponibles" value={slotState.blocked ? "Bloqueado" : `${available} / ${MAX_PER_SLOT}`} />
        {price && <Row label="Monto sugerido" value={`${CURRENCY} ${price}`} highlight />}
        <Row label="Método de pago" value="Transferencia" />
      </div>

      {/* Botón reservar */}
      <Button
        className="w-full btn-cta gap-2"
        disabled={!canReserve}
        onClick={onReserve}
      >
        <CalendarCheck size={16} /> Reservar turno
      </Button>

      {/* Modo admin */}
      <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--glass-border))]">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <ShieldCheck size={14} />
          Modo admin
        </label>
        <Switch checked={adminMode} onCheckedChange={onToggleAdmin} />
      </div>

      {adminMode && (
        <Button
          variant="outline"
          className="w-full gap-2 text-sm border-destructive/40 text-destructive hover:bg-destructive/10"
          disabled={!canBlock}
          onClick={onBlock}
        >
          <Lock size={14} /> Bloquear turno (2 cupos)
        </Button>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : ""}>{value}</span>
    </div>
  );
}
