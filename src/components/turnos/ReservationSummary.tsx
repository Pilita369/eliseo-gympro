// Panel derecho con resumen + acciones
// Yo soporte modo simple (1 turno) y modo pack (2x/3x/full)

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck, Lock, ShieldCheck, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { PLANS, DEFAULT_PRICE_BY_PLAN, CURRENCY, MAX_PER_SLOT } from "@/turnos/config";
import type { Plan, SlotState } from "@/turnos/types";

type DraftTurn = {
  dayLabel: string;
  dateISO: string;
  time: string;
};

type Props = {
  selectedPlan: Plan | "";
  selectedDay: { label: string; dateISO: string } | null;
  selectedTime: string | null;
  slotState: SlotState;

  adminMode: boolean;
  onToggleAdmin: (v: boolean) => void;

  // Pack
  requiredTurns: number;
  draftTurns: DraftTurn[];
  onAddTurn: () => void;
  onRemoveDraftTurn: (dateISO: string, time: string) => void;
  onClearDraft: () => void;
  onConfirmPack: () => void;

  // Simple
  onReserveSingle: () => void;

  // Admin
  onBlock: () => void;
};

export default function ReservationSummary({
  selectedPlan,
  selectedDay,
  selectedTime,
  slotState,
  adminMode,
  onToggleAdmin,

  requiredTurns,
  draftTurns,
  onAddTurn,
  onRemoveDraftTurn,
  onClearDraft,
  onConfirmPack,

  onReserveSingle,
  onBlock,
}: Props) {
  const planLabel = PLANS.find((p) => p.id === selectedPlan)?.label || "—";
  const price = selectedPlan ? DEFAULT_PRICE_BY_PLAN[selectedPlan] : undefined;

  const available = MAX_PER_SLOT - slotState.occupied;

  const isOnline = selectedPlan === "Online";
  const isPackPlan = selectedPlan !== "" && requiredTurns > 1;

  const canAddTurn =
    !!selectedPlan &&
    !isOnline &&
    !!selectedDay &&
    !!selectedTime &&
    available > 0 &&
    !slotState.blocked &&
    isPackPlan &&
    draftTurns.length < requiredTurns;

  const canConfirmPack = isPackPlan && draftTurns.length === requiredTurns;

  const canReserveSingle =
    !!selectedPlan &&
    (isOnline || (!!selectedDay && !!selectedTime)) &&
    (isOnline || (available > 0 && !slotState.blocked)) &&
    !isPackPlan;

  const canBlock =
    !!selectedPlan && !!selectedDay && !!selectedTime && slotState.occupied === 0 && !slotState.blocked;

  return (
    <div className="glass-card p-5 space-y-5 sticky top-24">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <CalendarCheck size={20} className="text-primary" />
        Resumen de reserva
      </h3>

      <div className="space-y-3 text-sm">
        <Row label="Plan" value={planLabel} />
        <Row
          label="Día"
          value={selectedDay ? `${selectedDay.label} (${selectedDay.dateISO})` : isOnline ? "Online" : "—"}
        />
        <Row label="Hora" value={selectedTime || (isOnline ? "A coordinar" : "—")} />
        <Row
          label="Cupos disponibles"
          value={isOnline ? "—" : slotState.blocked ? "Bloqueado" : `${available} / ${MAX_PER_SLOT}`}
        />
        {typeof price === "number" && <Row label="Monto sugerido" value={`${CURRENCY} ${price}`} highlight />}
        <Row label="Método de pago" value="Transferencia" />
      </div>

      {/* Modo pack */}
      {isPackPlan && (
        <div className="space-y-3">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-2">
              Yo armo tu pack: {draftTurns.length}/{requiredTurns} turnos seleccionados
            </p>

            {draftTurns.length === 0 ? (
              <p className="text-xs text-muted-foreground">Todavía no agregaste turnos.</p>
            ) : (
              <ul className="space-y-2">
                {draftTurns.map((t) => (
                  <li key={`${t.dateISO}_${t.time}`} className="flex items-center justify-between gap-3">
                    <span className="text-xs">
                      <span className="text-foreground font-medium">{t.dayLabel}</span>{" "}
                      <span className="text-muted-foreground">({t.dateISO})</span>{" "}
                      <span className="text-foreground font-medium">{t.time}</span>
                    </span>
                    <button
                      onClick={() => onRemoveDraftTurn(t.dateISO, t.time)}
                      className="text-destructive hover:opacity-80 transition"
                      aria-label="Quitar turno"
                      title="Quitar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="gap-2"
              disabled={!canAddTurn}
              onClick={onAddTurn}
            >
              <Plus size={16} /> Agregar turno
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              disabled={draftTurns.length === 0}
              onClick={onClearDraft}
            >
              <Trash2 size={16} /> Limpiar
            </Button>
          </div>

          <Button className="w-full btn-cta gap-2" disabled={!canConfirmPack} onClick={onConfirmPack}>
            <CheckCircle2 size={16} /> Confirmar pack
          </Button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Yo primero selecciono los turnos y recién al confirmar el pack se reservan los cupos.
          </p>
        </div>
      )}

      {/* Modo simple */}
      {!isPackPlan && (
        <Button className="w-full btn-cta gap-2" disabled={!canReserveSingle} onClick={onReserveSingle}>
          <CalendarCheck size={16} /> Reservar turno
        </Button>
      )}

      {/* Admin */}
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
