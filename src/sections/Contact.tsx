import { useState } from "react";
import { AnimatedSection } from "@/hooks/useScrollAnimation";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", contacto: "", mensaje: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mensaje enviado", description: "Nos pondremos en contacto pronto." });
    setForm({ nombre: "", contacto: "", mensaje: "" });
  };

  return (
    <AnimatedSection>
      <section id="contacto" className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="section-title mb-4">
              <span className="text-primary">Contacto</span>
            </h2>
            <p className="section-subtitle mx-auto">
              ¿Tenés alguna duda? Escribinos y te respondemos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 animate-on-scroll">
              <input
                type="text"
                placeholder="Tu nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <input
                type="text"
                placeholder="WhatsApp o Email"
                required
                value={form.contacto}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <textarea
                placeholder="Tu mensaje"
                rows={4}
                required
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
              <button type="submit" className="btn-cta flex items-center gap-2">
                <Send size={16} />
                Enviar mensaje
              </button>
            </form>

            {/* Links de contacto */}
            <div className="space-y-6 animate-on-scroll">
              <a
                href="https://wa.me/5492995777823"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center gap-4 glow-hover block"
              >
                <MessageCircle className="text-primary" size={24} />
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-muted-foreground text-xs">Escribinos directamente</p>
                </div>
              </a>
              <a
                href="https://instagram.com/eliseogym"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center gap-4 glow-hover block"
              >
                <svg className="text-primary w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <div>
                  <p className="font-semibold text-sm">Instagram</p>
                  <p className="text-muted-foreground text-xs">@eliseogym</p>
                </div>
              </a>
              <div className="glass-card p-5">
                <p className="font-semibold text-sm mb-1">Ubicación</p>
                <p className="text-muted-foreground text-xs">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
