import { AnimatedSection } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cuáles son los horarios de entrenamiento?",
    a: "Los turnos están disponibles de lunes a viernes de 07:00 a 14:00, en intervalos de 30 minutos. Podés elegir el horario que mejor se adapte a tu rutina.",
  },
  {
    q: "¿Cuántas personas entrenan por turno?",
    a: "Máximo 2 personas por turno. Esto garantiza atención personalizada y correcciones técnicas en tiempo real.",
  },
  {
    q: "¿Cómo reservo mi turno?",
    a: "Desde la sección de Turnos en esta misma web. Elegís tu plan, día y horario, y confirmás la reserva. Todo queda guardado para tu comodidad.",
  },
  {
    q: "¿Puedo cancelar o cambiar mi turno?",
    a: "Sí, podés modificar o cancelar tu reserva con anticipación desde la misma plataforma de turnos.",
  },
  {
    q: "¿Qué debo llevar al entrenamiento?",
    a: "Ropa cómoda deportiva, zapatillas apropiadas, toalla y botella de agua. Nosotros nos encargamos del resto.",
  },
  {
    q: "¿Cómo funciona la modalidad online?",
    a: "Recibís un plan personalizado con videos de referencia, seguimiento semanal y ajustes según tu progreso. Ideal si no podés asistir presencialmente.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. El entrenamiento se adapta a tu nivel. Desde principiantes hasta deportistas avanzados, todos son bienvenidos.",
  },
];

export default function FAQ() {
  return (
    <AnimatedSection>
      <section id="faq" className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="section-title mb-4">
              Preguntas <span className="text-primary">Frecuentes</span>
            </h2>
          </div>

          <div className="animate-on-scroll">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-card px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
