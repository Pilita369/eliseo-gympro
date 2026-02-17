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
    a: "Los turnos están disponibles de lunes a viernes de 07:00 a 14:00. Cada turno dura 1 hora, así puedo planificar el entrenamiento con tiempo real y sin apuro.",
  },
  {
    q: "¿Cuántas personas entrenan por turno?",
    a: "Máximo 2 personas por turno. Lo hago así para mantener la calidad del entrenamiento, corregir técnica en el momento y acompañar el proceso de forma personalizada.",
  },
  {
    q: "¿Cómo reservo mi turno?",
    a: "Desde la sección de Turnos en esta web. Elegís tu plan, el día y el horario disponible. Al finalizar, podés enviar el mensaje por WhatsApp o Email para coordinar el pago por transferencia y confirmar.",
  },
  {
    q: "¿Cómo funcionan los pagos?",
    a: "Los pagos se realizan del 1 al 10 de cada mes. Los pagos fuera de ese plazo tienen un recargo del 10%, porque la planificación y el cupo se organizan de forma mensual.",
  },
  {
    q: "¿Puedo cancelar o cambiar mi turno?",
    a: "Sí. Podés cancelar desde la misma plataforma con anticipación, así ese cupo queda disponible para otra persona. Si necesitás reprogramar, lo ideal es avisar lo antes posible para encontrar un horario libre.",
  },
  {
    q: "¿Qué debo llevar al entrenamiento?",
    a: "Ropa cómoda deportiva, zapatillas adecuadas, toalla y botella de agua. Yo me encargo de la planificación y de guiarte en cada parte del entrenamiento.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. El entrenamiento se adapta a tu nivel, desde personas que arrancan de cero hasta deportistas que buscan rendimiento. La idea es progresar con criterio, no a la fuerza.",
  },
  {
    q: "¿Cómo funciona la modalidad online?",
    a: "Recibís un plan personalizado, con indicaciones claras, seguimiento y ajustes según tu progreso. Es ideal si no podés asistir presencialmente o querés complementar tu entrenamiento.",
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
