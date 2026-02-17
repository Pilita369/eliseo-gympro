import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoBlanco from "@/assets/logo-blanco.webp";

const navItems = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Galería", href: "/#galeria" },
  { label: "Facundo", href: "/#facundo" },
  { label: "Planes", href: "/#planes" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Manejo de navegación con anclas
  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[hsl(var(--glass-border))]">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoBlanco} alt="Eliseo Gym" className="h-8 w-auto" />
          <span className="font-display font-bold text-lg tracking-widest text-foreground">GYM</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
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
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav mobile */}
      {open && (
        <div className="md:hidden glass border-t border-[hsl(var(--glass-border))] animate-fade-up">
          <nav className="flex flex-col p-4 gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.href)}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
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
