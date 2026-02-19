// Página principal de reservas — /turnos
// Yo implemento “packs” para 2x/3x/full (se agregan varios turnos y luego se confirma).

import { useState, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SlotGrid from "@/components/turnos/SlotGrid";
import ReservationSummary from "@/components/turnos/ReservationSummary";
import ReservationReceipt from "@/components/turnos/ReservationReceipt";
import MyReservations from "@/components/turnos/MyReservations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  PLANS,
  DAYS_CONFIG,
  TIME_SLOTS,
  MAX_PER_SLOT,
  DEFAULT_PRICE_BY_PLAN,
} from "@/turnos/config";
import {
  loadSlots,
  saveSlots,
  loadReservations,
  saveReservations,
} from "@/turnos/storage";
import { generateReservationId, generatePackId } from "@/turnos/reservation";
import type { Plan, Reservation, SlotsMap, SlotState } from "@/turnos/types";

// Yo defino cuántos turnos incluye cada plan
function requiredTurnsForPlan(plan: Plan | ""): number {
  if (!plan) return 0;
  if (plan === "2xSemana") return 2;
  if (plan === "3xSemana") return 3;
  if (plan === "TodaLaSemana") return 5;
  // Online no necesita seleccionar horarios
  return 0;
}

// Calculo las fechas reales de la semana actual (lunes a viernes)
function getWeekDates(): { label: string; dateISO: string; weekday: number }[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=dom
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return DAYS_CONFIG.map((d, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      label: d.label,
      dateISO: date.toISOString().split("T")[0],
      weekday: d.weekday,
    };
  });
}

type DraftTurn = {
  dayLabel: string;
  dateISO: string;
  time: string;
};

export default function Turnos() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Estado principal
  const [selectedPlan, setSelectedPlan] = useState<Plan | "">(
    (searchParams.get("plan") as Plan) || ""
  );
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [slots, setSlots] = useState<SlotsMap>(loadSlots);
  const [reservations, setReservations] = useState<Reservation[]>(
    loadReservations
  );

  // Yo guardo los turnos “en borrador” para armar el pack (2x/3x/full)
  const [draftTurns, setDraftTurns] = useState<DraftTurn[]>([]);
  // Yo genero un packId cuando empiezo a armar un pack (así quedan agrupados)
  const [draftPackId, setDraftPackId] = useState<string | null>(null);

  // Modal de confirmación post-reserva (ahora puede ser 1 reserva o varias)
  const [receiptReservation, setReceiptReservation] = useState<
    Reservation | Reservation[] | null
  >(null);

  // Modal de confirm para bloquear
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  // Modal de confirm para cancelar
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const weekDates = useMemo(getWeekDates, []);
  const currentDay = weekDates[selectedDayIdx];

  // Estado del slot seleccionado (para mostrar disponibilidad)
  const currentSlotKey =
    currentDay && selectedTime ? `${currentDay.dateISO}_${selectedTime}` : "";
  const currentSlotState: SlotState = currentSlotKey
    ? slots[currentSlotKey] || { occupied: 0, blocked: false }
    : { occupied: 0, blocked: false };

  const requiredTurns = requiredTurnsForPlan(selectedPlan);
  const isPackPlan = selectedPlan !== "" && requiredTurns > 1;

  // Persistir cambios
  const persistSlots = useCallback((next: SlotsMap) => {
    setSlots(next);
    saveSlots(next);
  }, []);

  const persistReservations = useCallback((next: Reservation[]) => {
    setReservations(next);
    saveReservations(next);
  }, []);

  // Yo reseteo el pack cuando cambia el plan (para evitar mezclar cosas)
  const handleSelectPlan = (p: Plan) => {
    setSelectedPlan(p);
    setSelectedTime(null);
    setDraftTurns([]);
    setDraftPackId(null);
  };

  // Yo verifico si un turno ya está dentro del borrador (para no duplicar)
  const draftHas = (dateISO: string, time: string) =>
    draftTurns.some((t) => t.dateISO === dateISO && t.time === time);

  // Yo agrego un turno al pack (sin reservar todavía)
  const handleAddTurnToPack = () => {
    if (!selectedPlan || !currentDay || !selectedTime) return;

    // Online no usa pack de horarios
    if (selectedPlan === "Online") return;

    const key = `${currentDay.dateISO}_${selectedTime}`;
    const state = slots[key] || { occupied: 0, blocked: false };

    if (state.blocked) {
      toast({ title: "Turno no disponible", description: "Este horario está bloqueado." });
      return;
    }
    if (state.occupied >= MAX_PER_SLOT) {
      toast({ title: "Turno completo", description: "Elegí otro horario." });
      return;
    }

    if (draftHas(currentDay.dateISO, selectedTime)) {
      toast({ title: "Ya agregado", description: "Ese turno ya está en tu selección." });
      return;
    }

    // Yo creo packId cuando agrego el primer turno
    if (!draftPackId) setDraftPackId(generatePackId());

    const next = [
      ...draftTurns,
      { dayLabel: currentDay.label, dateISO: currentDay.dateISO, time: selectedTime },
    ];
    setDraftTurns(next);
    setSelectedTime(null);

    toast({
      title: "Turno agregado",
      description: `${currentDay.label} ${selectedTime} (${next.length}/${requiredTurns})`,
    });
  };

  // Yo saco un turno del borrador (por si se arrepiente)
  const handleRemoveDraftTurn = (dateISO: string, time: string) => {
    const next = draftTurns.filter((t) => !(t.dateISO === dateISO && t.time === time));
    setDraftTurns(next);
    if (next.length === 0) setDraftPackId(null);
  };

  // Yo limpio la selección de pack
  const handleClearDraft = () => {
    setDraftTurns([]);
    setDraftPackId(null);
    setSelectedTime(null);
  };

  // Yo confirmo el pack: recién acá “ocupo” cupos y creo reservas
  const handleConfirmPack = () => {
    if (!selectedPlan) return;
    if (!draftPackId) return;

    if (draftTurns.length !== requiredTurns) {
      toast({
        title: "Faltan turnos",
        description: `Te faltan ${requiredTurns - draftTurns.length} para completar el plan.`,
      });
      return;
    }

    // Yo verifico disponibilidad final (por si alguien ocupó un cupo mientras armaba el pack)
    for (const t of draftTurns) {
      const key = `${t.dateISO}_${t.time}`;
      const state = slots[key] || { occupied: 0, blocked: false };
      if (state.blocked || state.occupied >= MAX_PER_SLOT) {
        toast({
          title: "Un turno se ocupó",
          description: `El turno ${t.dayLabel} ${t.time} ya no está disponible.`,
        });
        return;
      }
    }

    // Yo ocupo 1 cupo por cada turno del pack
    const nextSlots: SlotsMap = { ...slots };
    for (const t of draftTurns) {
      const key = `${t.dateISO}_${t.time}`;
      const state = nextSlots[key] || { occupied: 0, blocked: false };
      nextSlots[key] = { ...state, occupied: state.occupied + 1 };
    }
    persistSlots(nextSlots);

    // Yo creo todas las reservas agrupadas
    const createdAt = new Date().toISOString();
    const created: Reservation[] = draftTurns.map((t, idx) => ({
      id: generateReservationId(),
      plan: selectedPlan,
      dayLabel: t.dayLabel,
      dateISO: t.dateISO,
      time: t.time,
      qty: 1,
      status: "Pendiente de pago",
      createdAt,
      paymentMethod: "Transferencia",
      amountSuggested: DEFAULT_PRICE_BY_PLAN[selectedPlan],
      packId: draftPackId,
      packTotal: requiredTurns,
      packIndex: idx + 1,
    }));

    persistReservations([...reservations, ...created]);

    toast({
      title: "Pack reservado",
      description: `Se reservaron ${created.length} turnos.`,
    });

    setReceiptReservation(created);
    handleClearDraft();
  };

  // Reservar 1 cupo (modo simple: 1 turno)
  const handleReserveSingle = () => {
    if (!selectedPlan) return;

    // Online: reservo “sin horario” para coordinar
    if (selectedPlan === "Online") {
      const r: Reservation = {
        id: generateReservationId(),
        plan: selectedPlan,
        dayLabel: "Online",
        dateISO: "—",
        time: "A coordinar",
        qty: 1,
        status: "Pendiente de pago",
        createdAt: new Date().toISOString(),
        paymentMethod: "Transferencia",
        amountSuggested: DEFAULT_PRICE_BY_PLAN[selectedPlan],
        note: "Modalidad online: coordinación por WhatsApp.",
      };

      persistReservations([...reservations, r]);
      toast({ title: "Reserva creada", description: "Online — A coordinar" });
      setReceiptReservation(r);
      return;
    }

    if (!currentDay || !selectedTime) return;
    const key = `${currentDay.dateISO}_${selectedTime}`;
    const state = slots[key] || { occupied: 0, blocked: false };
    if (state.occupied >= MAX_PER_SLOT || state.blocked) return;

    const nextSlots = { ...slots, [key]: { ...state, occupied: state.occupied + 1 } };
    persistSlots(nextSlots);

    const r: Reservation = {
      id: generateReservationId(),
      plan: selectedPlan,
      dayLabel: currentDay.label,
      dateISO: currentDay.dateISO,
      time: selectedTime,
      qty: 1,
      status: "Pendiente de pago",
      createdAt: new Date().toISOString(),
      paymentMethod: "Transferencia",
      amountSuggested: DEFAULT_PRICE_BY_PLAN[selectedPlan],
    };

    persistReservations([...reservations, r]);
    toast({ title: "Turno reservado", description: `${currentDay.label} ${selectedTime}` });
    setReceiptReservation(r);
    setSelectedTime(null);
  };

  // Bloquear turno (2 cupos, admin)
  const handleBlock = () => {
    if (!currentDay || !selectedTime) return;
    const key = `${currentDay.dateISO}_${selectedTime}`;
    const state = slots[key] || { occupied: 0, blocked: false };
    if (state.occupied > 0 || state.blocked) return;

    const nextSlots = { ...slots, [key]: { occupied: MAX_PER_SLOT, blocked: true } };
    persistSlots(nextSlots);
    toast({
      title: "Turno bloqueado",
      description: `${currentDay.label} ${selectedTime} — 2 cupos`,
    });
    setBlockConfirmOpen(false);
    setSelectedTime(null);
  };

  // Marcar comprobante enviado (si es pack, lo marco por id individual)
  const handleMarkSent = (id: string) => {
    const next = reservations.map((r) =>
      r.id === id ? { ...r, status: "Comprobante enviado" as const } : r
    );
    persistReservations(next);

    setReceiptReservation((prev) => {
      if (!prev) return prev;
      if (Array.isArray(prev)) {
        return prev.map((p) => (p.id === id ? { ...p, status: "Comprobante enviado" } : p));
      }
      return prev.id === id ? { ...prev, status: "Comprobante enviado" } : prev;
    });

    toast({ title: "Estado actualizado", description: "Comprobante enviado." });
  };

  // Cancelar reserva
  const handleCancel = (id: string) => {
    setCancelTarget(id);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    const r = reservations.find((r) => r.id === cancelTarget);
    if (!r) return;

    const key = `${r.dateISO}_${r.time}`;
    const state = slots[key] || { occupied: 0, blocked: false };
    const nextSlots = {
      ...slots,
      [key]: { ...state, occupied: Math.max(0, state.occupied - r.qty) },
    };
    persistSlots(nextSlots);

    const next = reservations.map((res) =>
      res.id === cancelTarget ? { ...res, status: "Cancelado" as const } : res
    );
    persistReservations(next);

    toast({ title: "Reserva cancelada", description: `Reserva ${cancelTarget}` });
    setCancelTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Encabezado */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="glass-card p-2 glow-hover">
              <ArrowLeft className="text-primary" size={20} />
            </Link>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Reservar <span className="text-primary">Turno</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Elegí tu plan, día y horario. Reservá y pagá por transferencia.
              </p>
            </div>
          </div>

          {/* Layout 2 columnas */}
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              {/* Selector de plan */}
              <div>
                <p className="text-sm font-medium mb-3">Plan</p>
                <div className="flex flex-wrap gap-2">
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPlan(p.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedPlan === p.id
                          ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(180_78%_44%_/_0.3)]"
                          : "glass-card text-muted-foreground hover:text-foreground glow-hover"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de día con tabs */}
              <div>
                <p className="text-sm font-medium mb-3">Día</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {weekDates.map((d, i) => (
                    <button
                      key={d.dateISO}
                      onClick={() => {
                        setSelectedDayIdx(i);
                        setSelectedTime(null);
                      }}
                      className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-[72px] ${
                        selectedDayIdx === i
                          ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(180_78%_44%_/_0.3)]"
                          : "glass-card text-muted-foreground hover:text-foreground glow-hover"
                      }`}
                    >
                      <span className="font-semibold">{d.label.slice(0, 3)}</span>
                      <span className="text-[10px] mt-0.5 opacity-80">{d.dateISO.slice(5)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grilla de horarios */}
              <div>
                <p className="text-sm font-medium mb-3">Horario</p>
                <SlotGrid
                  timeSlots={TIME_SLOTS}
                  selectedDate={currentDay.dateISO}
                  slots={slots}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                />

                {/* Yo muestro un aviso corto cuando el plan es pack */}
                {isPackPlan && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Yo voy armando tu plan: agregá {requiredTurns} turnos (uno por vez) y después confirmás el pack.
                  </p>
                )}
              </div>

              {/* Leyenda */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded glass-card" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/15 border border-primary/40" />
                  <span>1/2 ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted/40 border border-border" />
                  <span>Completo</span>
                </div>
              </div>
            </div>

            {/* Columna derecha: resumen */}
            <div>
              <ReservationSummary
                selectedPlan={selectedPlan}
                selectedDay={currentDay}
                selectedTime={selectedTime}
                slotState={currentSlotState}
                adminMode={adminMode}
                onToggleAdmin={setAdminMode}
                // pack
                requiredTurns={requiredTurns}
                draftTurns={draftTurns}
                onAddTurn={handleAddTurnToPack}
                onRemoveDraftTurn={handleRemoveDraftTurn}
                onClearDraft={handleClearDraft}
                onConfirmPack={handleConfirmPack}
                // single
                onReserveSingle={handleReserveSingle}
                onBlock={() => setBlockConfirmOpen(true)}
              />
            </div>
          </div>

          {/* Mis reservas */}
          <div className="mt-12">
            <MyReservations reservations={reservations} onCancel={handleCancel} />
          </div>
        </div>
      </main>

      {/* Modal recibo */}
      <ReservationReceipt
        reservation={receiptReservation}
        open={!!receiptReservation}
        onClose={() => setReceiptReservation(null)}
        onMarkSent={handleMarkSent}
      />

      {/* Modal confirmar bloqueo */}
      <Dialog open={blockConfirmOpen} onOpenChange={setBlockConfirmOpen}>
        <DialogContent className="glass-card border-[hsl(var(--glass-border))] bg-[hsl(220_18%_10%)]">
          <DialogHeader>
            <DialogTitle>¿Bloquear este turno?</DialogTitle>
            <DialogDescription>
              Se marcarán 2 cupos como ocupados. El horario quedará como "Completo".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setBlockConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBlock}>
              Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal confirmar cancelación */}
      <Dialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <DialogContent className="glass-card border-[hsl(var(--glass-border))] bg-[hsl(220_18%_10%)]">
          <DialogHeader>
            <DialogTitle>¿Cancelar esta reserva?</DialogTitle>
            <DialogDescription>
              Se liberará 1 cupo del turno. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setCancelTarget(null)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancelar reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
