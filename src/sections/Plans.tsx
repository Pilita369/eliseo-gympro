import { Link } from "react-router-dom";
import { AnimatedSection } from "@/hooks/useScrollAnimation";
import { Check } from "lucide-react";
import { DEFAULT_PRICE_BY_PLAN } from "@/turnos/config";

type PlanId = "2xSemana" | "3xSemana" | "TodaLaSemana" | "Online";

const plans: {
  id: PlanId;
  title: string;
  description: string;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "2xSemana",
    title: "2 veces por semana",
    description: "Ideal para empezar o complementar tu rutina.",
    features: ["2 sesiones semanales", "Planificación personalizada", "Seguimiento técnico"],
  },
  {
    id: "3xSemana",
    title: "3 veces por semana",
    description: "El equilibrio perfecto entre volumen y recuperación.",
    features: ["3 sesiones semanales", "Programación progresiva", "Correcciones en vivo"],
    popular: true,
  },
  {
    id: "TodaLaSemana",
    title: "Toda la semana",
    description: "Para quienes buscan el máximo rendimiento.",
    features: ["Acceso completo", "Periodización avanzada", "Prioridad en horarios"],
  },
  {
    id: "Online",
    title: "Online",
    description: "Entrenamiento a distancia con seguimiento real.",
    features: ["Plan 100% online", "Videos de referencia", "Ajustes semanales"],
  },
];

function formatARS(value?: number) {
  // Yo formateo el precio en ARS prolijo.
  if (!value) return "Consultar";
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function Plans() {
  return (
    <AnimatedSection>
      <section id="planes" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="section-title mb-4">
              Elegí tu <span className="text-primary">Plan</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Yo elijo el plan y después reservo el turno en 1 minuto.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const price = DEFAULT_PRICE_BY_PLAN[plan.id];

              return (
                <div
                  key={plan.id}
                  className={`animate-on-scroll glass-card p-6 flex flex-col glow-hover relative ${
                    plan.popular ? "border-primary/40" : ""
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary/25 border border-primary/40 text-xs font-semibold text-primary backdrop-blur">
                      Más elegido
                    </div>
                  )}

                  <h3 className="font-display text-xl font-bold">{plan.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>

                  {/* Yo muestro el precio acá para que quede claro */}
                  <div className="mt-5">
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="text-2xl font-extrabold">{formatARS(price)}</p>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="text-primary mt-0.5" size={16} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-2">
                    <Link
                      // Yo mando el id correcto para preseleccionar plan en el turnero
                      to={`/turnos?plan=${plan.id}`}
                      className={plan.popular ? "btn-cta text-sm text-center w-full" : "btn-outline-glow text-sm text-center w-full"}
                    >
                      Elegir plan
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

         <p className="text-center text-xs text-muted-foreground mt-10">
  Valores sujetos a actualización.
</p>

        </div>
      </section>
    </AnimatedSection>
  );
}
