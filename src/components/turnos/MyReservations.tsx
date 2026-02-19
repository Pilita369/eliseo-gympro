// Mis reservas (yo agrupo por packId para que no se vea “una por una”)

import type { Reservation } from "@/turnos/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, Mail, CalendarPlus, XCircle } from "lucide-react";
import { buildMessage, buildWhatsAppUrl, buildMailtoUrl } from "@/turnos/reservation";
import { downloadICS } from "@/turnos/ics";
import { useToast } from "@/hooks/use-toast";

type Props = {
  reservations: Reservation[];
  onCancel: (id: string) => void;
};

type Group = {
  key: string; // packId o id
  isPack: boolean;
  items: Reservation[];
};

export default function MyReservations({ reservations, onCancel }: Props) {
  const { toast } = useToast();

  if (!reservations || reservations.length === 0) return null;

  // Yo agrupo por packId si existe, sino por id
  const map = new Map<string, Reservation[]>();
  for (const r of reservations) {
    const k = r.packId || r.id;
    map.set(k, [...(map.get(k) || []), r]);
  }

  const groups: Group[] = Array.from(map.entries()).map(([key, items]) => ({
    key,
    isPack: items.length > 1,
    items: items.sort((a, b) => (a.packIndex || 0) - (b.packIndex || 0)),
  }));

  // Yo ordeno por fecha de creación (más nuevo arriba)
  groups.sort((a, b) => {
    const ad = new Date(a.items[0].createdAt).getTime();
    const bd = new Date(b.items[0].createdAt).getTime();
    return bd - ad;
  });

  const statusColor: Record<string, string> = {
    "Pendiente de pago": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Comprobante enviado": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Confirmado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Cancelado": "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Mensaje copiado al portapapeles." });
  };

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold">
        Mis <span className="text-primary">reservas</span>
      </h2>

      <div className="space-y-4">
        {groups.map((g) => {
          const first = g.items[0];
          const headerId = g.isPack ? (first.packId || g.key) : first.id;

          return (
            <div key={g.key} className="glass-card p-5 rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">{headerId}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {first.plan} {g.isPack ? `— ${g.items.length} turnos` : ""}
                  </p>
                </div>

                <Badge className={`text-xs border ${statusColor[first.status] || ""}`}>
                  {first.status}
                </Badge>
              </div>

              {/* Yo muestro el detalle del pack */}
              <div className="mt-4 space-y-1 text-sm">
                {g.items.map((r, idx) => (
                  <div key={r.id} className="text-muted-foreground flex justify-between gap-3">
                    <span>
                      {g.isPack ? `${idx + 1}) ` : ""}
                      <span className="text-foreground font-medium">{r.dayLabel}</span>{" "}
                      <span>({r.dateISO})</span>
                    </span>
                    <span className="text-foreground font-medium">{r.time}</span>
                  </div>
                ))}
              </div>

              {/* Acciones: yo uso buildMessage/WA/Email con pack completo */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="ghost" className="gap-2 text-xs" onClick={() => copyToClipboard(buildMessage(g.isPack ? g.items : first))}>
                  <Copy size={14} /> Copiar
                </Button>

                <Button variant="ghost" className="gap-2 text-xs" onClick={() => window.open(buildWhatsAppUrl(g.isPack ? g.items : first), "_blank")}>
                  <MessageCircle size={14} /> WA
                </Button>

                <Button variant="ghost" className="gap-2 text-xs" onClick={() => window.open(buildMailtoUrl(g.isPack ? g.items : first), "_blank")}>
                  <Mail size={14} /> Email
                </Button>

                <Button
                  variant="ghost"
                  className="gap-2 text-xs"
                  onClick={() => g.items.forEach((r) => downloadICS(r))}
                >
                  <CalendarPlus size={14} /> ICS
                </Button>

                {/* Nota: por ahora el cancelar cancela 1 reserva (la primera). Si querés cancelar pack, lo hacemos después bien */}
                <Button
                  variant="ghost"
                  className="gap-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => onCancel(first.id)}
                >
                  <XCircle size={14} /> Cancelar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
