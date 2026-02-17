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
  { value: "+12", label: "Años de experiencia" },
  { value: "100%", label: "Entrenamiento personalizado" },
  { value: "2", label: "Personas máximo por turno" },
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

                <h2 className="section-title mb-6">Soy Facundo</h2>

                {/* 
                  Yo organizo el texto en 2 columnas en desktop 
                  y lo mantengo en una sola columna en mobile.
                */}
                <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-4 md:columns-2 md:gap-8">
                  
                  <p>
                    Soy Profesor de Educación Física, especializado en preparación física y entrenamiento aplicado al deporte. 
                    Me formé con referentes del alto rendimiento como Horacio E. Anselmi y profundicé mi desarrollo en el entrenamiento 
                    específico del vóley, incorporando herramientas vinculadas al trabajo de Alejandro Bertorello.
                  </p>

                  <p>
                    Trabajé como formador y entrenador en la Municipalidad de Neuquén, acompañando deportistas desde categorías 
                    formativas hasta instancias competitivas. Esa experiencia me permitió entender que el rendimiento no es solo físico: 
                    es proceso, educación y construcción a largo plazo.
                  </p>

                  <p>
                    La misión de este espacio es mejorar la calidad de vida a través del movimiento consciente, combinando tecnificación 
                    deportiva con planificación profesional. Trabajo con evaluaciones iniciales como FMS para detectar limitaciones, 
                    prevenir lesiones y diseñar entrenamientos personalizados.
                  </p>

                  <p className="font-medium text-foreground">
                    No busco entrenar por intensidad sin dirección. Busco construir rendimiento con criterio. 
                    Porque estar agotado no siempre significa estar mejorando.
                  </p>

                </div>
              </div>

              {/* Especialidades */}
              <div className="grid grid-cols-2 gap-3">
                {specialties.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="glass-card p-4 flex items-center gap-3 glow-hover"
                  >
                    <Icon className="text-primary" size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-display font-bold text-primary">
                      {m.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {m.label}
                    </p>
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
