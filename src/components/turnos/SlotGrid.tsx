// Grilla de horarios con estados visuales por slot

import { Lock, Clock } from "lucide-react";
import { MAX_PER_SLOT } from "@/turnos/config";
import type { SlotState } from "@/turnos/types";

type Props = {
  timeSlots: string[];
  selectedDate: string;
  slots: Record<string, SlotState>;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
};

export default function SlotGrid({ timeSlots, selectedDate, slots, selectedTime, onSelectTime }: Props) {
  // Obtengo el estado de un slot
  const getState = (time: string): SlotState => {
    const key = `${selectedDate}_${time}`;
    return slots[key] || { occupied: 0, blocked: false };
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {timeSlots.map((time) => {
        const state = getState(time);
        const isFull = state.occupied >= MAX_PER_SLOT || state.blocked;
        const isPartial = state.occupied === 1 && !state.blocked;
        const isSelected = selectedTime === time && !isFull;

        return (
          <button
            key={time}
            disabled={isFull}
            onClick={() => onSelectTime(time)}
            className={`
              relative flex items-center justify-center gap-1.5 h-12 rounded-lg text-sm font-medium
              transition-all duration-200 border
              ${isFull
                ? "bg-muted/40 border-border text-muted-foreground cursor-not-allowed"
                : isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(180_78%_44%_/_0.35)]"
                  : isPartial
                    ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/25 hover:shadow-[0_0_12px_hsl(180_78%_44%_/_0.15)]"
                    : "glass-card text-foreground hover:border-primary/60 hover:shadow-[0_0_12px_hsl(180_78%_44%_/_0.15)]"
              }
            `}
          >
            {isFull ? (
              <>
                <Lock size={12} />
                <span className="text-xs">Completo</span>
              </>
            ) : (
              <>
                <Clock size={12} className={isSelected ? "text-primary-foreground" : "text-muted-foreground"} />
                <span>{time}</span>
                {isPartial && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
