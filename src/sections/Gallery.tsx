import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/hooks/useScrollAnimation";
import gym1 from "@/assets/gym-1.webp";
import gym2 from "@/assets/gym-3.webp";
import gym3 from "@/assets/gym-2.webp";
import gym4 from "@/assets/gym-4.webp";
import gym5 from "@/assets/gym-5.webp";
import gym6 from "@/assets/gym-6.webp"; // nueva
import gym7 from "@/assets/gym-7.webp"; // nueva

const images = [
  { src: gym1, alt: "Zona de pesas" },
  { src: gym2, alt: "Entrenamiento funcional" },
  { src: gym3, alt: "Zona cardio" },
  { src: gym4, alt: "Movilidad y flexibilidad" },
  { src: gym5, alt: "Vestuarios" },
  { src: gym6, alt: "Espacio de clases" },      // nueva
  { src: gym7, alt: "Área de máquinas" },     // nueva
];

export default function Gallery() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <AnimatedSection>
      <section id="galeria" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="section-title mb-4">
              Nuestro <span className="text-primary">Espacio</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Un ambiente diseñado para que te enfoques en lo que importa.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto animate-on-scroll">
            <div className="overflow-hidden rounded-2xl glass-card">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    className="w-full flex-shrink-0 aspect-video object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass-card p-2 glow-hover"
              aria-label="Anterior"
            >
              <ChevronLeft className="text-primary" size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass-card p-2 glow-hover"
              aria-label="Siguiente"
            >
              <ChevronRight className="text-primary" size={24} />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}