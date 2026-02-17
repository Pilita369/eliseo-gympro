import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoBlanco from "@/assets/logo-blanco.webp";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Yo uso BASE_URL para que GitHub Pages nunca me mande al root del dominio.
  const base = import.meta.env.BASE_URL;

  const navLinks = [
    { label: "Inicio", id: "inicio" },
    { label: "Galería", id: "galeria" },
    { label: "Facundo", id: "facundo" },
    { label: "Planes", id: "planes" },
    { label: "Preguntas frecuentes", id: "faq" },
    { label: "Contacto", id: "contacto" },
  ];

  // Yo navego al inicio y scrolleo a la sección sin romper GitHub Pages.
  const goToSection = (id: string) => {
    setOpen(false);

    // Si no estoy en Home, primero vuelvo a "/" y después hago scroll.
    if (location.pathname !== "/") {
      navigate("/");

      // Yo espero un tick para que el Home renderice y exista el id.
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);

      return;
    }

    // Si ya estoy en Home, hago scroll directo.
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    // Yo actualizo el hash sin recargar la página.
    window.history.replaceState(null, "", `${base}#${id}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[hsl(var(--glass-border))]">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >
          <img src={logoBlanco} alt="Eliseo Gym" className="h-8 w-auto" />
          <span className="font-display font-bold text-lg tracking-widest text-foreground">
            GYM
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              type="button"
            >
              {item.label}
            </button>
          ))}

          <Link to="/turnos" className="btn-cta text-sm">
            Reservar turno
          </Link>
        </nav>

        {/* Hamburguesa mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2"
          aria-label="Menú"
          type="button"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav mobile */}
      {open && (
        <div className="md:hidden glass border-t border-[hsl(var(--glass-border))] animate-fade-up">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                type="button"
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/turnos"
              onClick={() => setOpen(false)}
              className="btn-cta text-sm text-center mt-2"
            >
              Reservar turno
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
