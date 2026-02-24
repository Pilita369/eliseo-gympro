import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-gym.webp";

export default function Hero() {
  const reservasHabilitadas = false; // 🔥 Cambiá esto a true cuando quieras activarlo

  const scrollToPlans = () => {
    document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <img
        src={heroImg}
        alt="Eliseo Gym interior"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-block glass-card px-4 py-1.5 mb-6 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            Centro de Tecnificación Deportiva
          </span>
        </div>

        {/* Título */}
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          ELISEO <span className="text-primary">GYM</span>
        </h1>

        {/* Descripción */}
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          Entrenamiento técnico, personalizado y consciente.
        </p>

        {/* Botones */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {reservasHabilitadas ? (
            <Link to="/turnos" className="btn-cta text-base">
              Reservar turno
            </Link>
          ) : (
            <button
              className="btn-cta text-base opacity-50 cursor-not-allowed"
              disabled
            >
              Próximamente
            </button>
          )}

          <button
            onClick={scrollToPlans}
            className="btn-outline-glow text-base"
          >
            Ver planes
          </button>
        </div>
      </div>
    </section>
  );
}