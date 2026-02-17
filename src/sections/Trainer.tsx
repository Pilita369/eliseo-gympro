import { AnimatedSection } from "@/hooks/useScrollAnimation";
import { Dumbbell, Target, StretchHorizontal, ClipboardList } from "lucide-react";
import facuImg from "@/assets/facu-trainer.webp";

const specialties = [
  { icon: Dumbbell, label: "Fuerza" },
  { icon: Target, label: "Técnica" },
  { icon: StretchHorizontal, label: "Movilidad" },
  { icon: ClipboardList, label: "Planificación personalizada" },
];

const metrics = [
  { value: "+8", label: "Años de experiencia" },
  { value: "100%", label: "Entrenamiento personalizado" },
  { value: "24/7", label: "Seguimiento continuo" },
];

export default function Trainer() {
  return (
    <AnimatedSection>
      <section id="facundo" className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Imagen */}
            <div className="animate-on-scroll">
              <div className="glass-card overflow-hidden rounded-2xl glow-hover">
                <img
                  src={facuImg}
                  alt="Facundo — Entrenador"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8 animate-on-scroll">
              <div>
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
                  Tu entrenador
                </p>
                <h2 className="section-title mb-4">Facundo</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Profesional apasionado por el movimiento humano. Mi enfoque combina ciencia, 
                  técnica y una escucha activa de cada persona. Creo en el proceso, en la 
                  constancia y en construir bases sólidas para un rendimiento real y sostenible.
                </p>
              </div>

              {/* Especialidades */}
              <div className="grid grid-cols-2 gap-3">
                {specialties.map(({ icon: Icon, label }) => (
                  <div key={label} className="glass-card p-4 flex items-center gap-3 glow-hover">
                    <Icon className="text-primary" size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-display font-bold text-primary">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
