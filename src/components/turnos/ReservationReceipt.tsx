// Modal/tarjeta de confirmación tras reservar
// Yo soporte 1 reserva o un pack (varios turnos)

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Mail, CalendarPlus, CheckCircle, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  TRANSFER_ALIAS,
  TRANSFER_CBU,
  TRANSFER_OWNER,
  CURRENCY,
  QR_IMAGE_PATH,
  GYM_NAME,
} from "@/turnos/config";
import { buildMessage, buildWhatsAppUrl, buildMailtoUrl } from "@/turnos/reservation";
import { downloadICS } from "@/turnos/ics";
import type { Reservation } from "@/turnos/types";

type Props = {
  reservation: Reservation | Reservation[] | null;
  open: boolean;
  onClose: () => void;
  onMarkSent: (id: string) => void;
};

export default function ReservationReceipt({ reservation, open, onClose, onMarkSent }: Props) {
  const { toast } = useToast();
  const [qrError, setQrError] = useState(false);

  const list = useMemo(() => {
    if (!reservation) return [];
    return Array.isArray(reservation) ? reservation : [reservation];
  }, [reservation]);

  if (!reservation || list.length === 0) return null;

  const first = list[0];

  const statusColor: Record<string, string> = {
    "Pendiente de pago": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Comprobante enviado": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Confirmado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Cancelado": "bg-red-500/20 text-red-400 border-red-500/30",
  };

  // Yo copio rápido al portapapeles
  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado al portapapeles.` });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg glass-card border-[hsl(var(--glass-border))] bg-[hsl(220_18%_10%)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <CheckCircle className="text-primary" size={24} />
            {Array.isArray(reservation) ? "Pack reservado" : "Turno reservado"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Info principal */}
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Nº</span>
              <span className="font-mono text-sm text-primary font-semibold">
                {Array.isArray(reservation) ? (first.packId || "—") : first.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Estado</span>
              <Badge className={`text-xs border ${statusColor[first.status] || ""}`}>{first.status}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Plan</span>
              <span className="text-sm">{first.plan}</span>
            </div>

            {/* Yo muestro 1 o varios turnos */}
            <div className="pt-2 border-t border-[hsl(var(--glass-border))]">
              <p className="text-xs text-muted-foreground mb-2">
                {Array.isArray(reservation) ? "Turnos incluidos" : "Turno"}
              </p>
              <div className="space-y-1">
                {list.map((r, idx) => (
                  <div key={r.id} className="text-sm flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {Array.isArray(reservation) ? `${idx + 1}) ` : ""}{r.dayLabel} ({r.dateISO})
                    </span>
                    <span className="text-foreground font-medium">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {typeof first.amountSuggested === "number" && (
              <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--glass-border))]">
                <span className="text-xs text-muted-foreground">Monto sugerido</span>
                <span className="text-sm font-semibold text-primary">
                  {CURRENCY} {first.amountSuggested}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Para confirmar, realizá la transferencia y enviá el comprobante por WhatsApp o Email.
          </p>

          {/* Datos transferencia */}
          <div className="glass-card p-4 space-y-3">
            <h4 className="text-sm font-semibold text-primary">Datos de transferencia</h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Alias</p>
                  <p className="text-sm font-mono">{TRANSFER_ALIAS}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyText(TRANSFER_ALIAS, "Alias")}>
                  <Copy size={14} />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">CBU</p>
                  <p className="text-sm font-mono">{TRANSFER_CBU}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyText(TRANSFER_CBU, "CBU")}>
                  <Copy size={14} />
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Titular</p>
                <p className="text-sm">{TRANSFER_OWNER}</p>
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center gap-2">
            {!qrError ? (
              <img
                src={QR_IMAGE_PATH}
                alt={`QR de transferencia — ${GYM_NAME}`}
                className="w-40 h-40 rounded-lg border border-[hsl(var(--glass-border))] bg-white p-2 object-contain"
                onError={() => setQrError(true)}
              />
            ) : (
              <div className="w-40 h-40 rounded-lg border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                <Image size={24} />
                <span className="text-[10px] text-center leading-tight px-2">
                  Subí tu QR a<br />public/qr-transferencia.png
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">Escaneá para transferir</span>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => window.open(buildWhatsAppUrl(reservation), "_blank")}
            >
              <MessageCircle size={14} /> WhatsApp
            </Button>

            <Button
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => window.open(buildMailtoUrl(reservation), "_blank")}
            >
              <Mail size={14} /> Email
            </Button>

            <Button
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => copyText(buildMessage(reservation), "Mensaje")}
            >
              <Copy size={14} /> Copiar mensaje
            </Button>

            <Button
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => list.forEach((r) => downloadICS(r))}
            >
              <CalendarPlus size={14} /> Descargar .ics
            </Button>
          </div>

          {/* Marcar enviado */}
          {first.status === "Pendiente de pago" && (
            <Button className="w-full btn-cta" onClick={() => onMarkSent(first.id)}>
              <CheckCircle size={16} className="mr-1.5" />
              Marcar como comprobante enviado
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
