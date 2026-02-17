// Lista de reservas del usuario guardadas en localStorage

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Mail, CalendarPlus, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildMessage, buildWhatsAppUrl, buildMailtoUrl } from "@/turnos/reservation";
import { downloadICS } from "@/turnos/ics";
import type { Reservation } from "@/turnos/types";

type Props = {
  reservations: Reservation[];
  onCancel: (id: string) => void;
};

const statusColor: Record<string, string> = {
  "Pendiente de pago": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Comprobante enviado": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Confirmado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Cancelado": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function MyReservations({ reservations, onCancel }: Props) {
  const { toast } = useToast();

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Mensaje copiado al portapapeles." });
  };

  // Muestro solo reservas activas primero, canceladas al final
  const sorted = [...reservations].sort((a, b) => {
    if (a.status === "Cancelado" && b.status !== "Cancelado") return 1;
    if (a.status !== "Cancelado" && b.status === "Cancelado") return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-bold">
        Mis <span className="text-primary">reservas</span>
      </h3>
      <div className="space-y-3">
        {sorted.map((r) => (
          <div key={r.id} className={`glass-card p-4 space-y-3 transition-opacity ${r.status === "Cancelado" ? "opacity-50" : ""}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary font-semibold">{r.id}</span>
              <Badge className={`text-[10px] border ${statusColor[r.status] || ""}`}>{r.status}</Badge>
            </div>
            {/* Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{r.plan}</span>
              <span>{r.dayLabel} ({r.dateISO})</span>
              <span>{r.time}</span>
            </div>
            {/* Acciones */}
            {r.status !== "Cancelado" && (
              <div className="flex flex-wrap gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => copyText(buildMessage(r))}>
                  <Copy size={12} /> Copiar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => window.open(buildWhatsAppUrl(r), "_blank")}>
                  <MessageCircle size={12} /> WA
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => window.open(buildMailtoUrl(r), "_blank")}>
                  <Mail size={12} /> Email
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => downloadICS(r)}>
                  <CalendarPlus size={12} /> ICS
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-destructive hover:text-destructive" onClick={() => onCancel(r.id)}>
                  <XCircle size={12} /> Cancelar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
