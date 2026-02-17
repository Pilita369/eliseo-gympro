import { WHATSAPP_NUMBER, INSTAGRAM_URL, GYM_LOCATION } from "@/turnos/config";
import logoBlanco from "@/assets/logo-blanco.webp";

const footerLinks = [
  { label: "Inicio", hash: "#inicio" },
  { label: "Planes", hash: "#planes" },
  { label: "Turnos", to: "/turnos" },
  { label: "Contacto", hash: "#contacto" },
];

export default function Footer() {
  const base = import.meta.env.BASE_URL;

  const waMessage = encodeURIComponent(
    "Hola! Quiero consultar por planes y turnos en Eliseo Gym."
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <footer className="bg-secondary/50 border-t border-border">
      {/* Línea animada */}
      <div className="h-px animated-gradient-line" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          
         {/* Marca con logo */}
<div className="flex flex-col items-center text-center">
  {/* Yo centro el logo */}
  <img
    src={logoBlanco}
    alt="Eliseo Gym"
    className="h-20 mb-3 object-contain"
    loading="lazy"
  />

  {/* Yo centro el texto debajo */}
  <p className="text-muted-foreground text-sm">
    Centro de Tecnificación Deportiva
  </p>
</div>


          {/* Navegación */}
          <div>
            <p className="font-semibold text-sm mb-3">Navegación</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {"hash" in link ? (
                    <a
                      href={`${base}${link.hash}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={`${base}${link.to.replace(/^\//, "")}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-sm mb-3">Horarios</p>
            <p className="text-muted-foreground text-sm">Lunes a Viernes</p>
            <p className="text-muted-foreground text-sm">07:00 — 14:00</p>

            <p className="text-muted-foreground text-sm mt-3">
              {GYM_LOCATION}
            </p>

            {/* Redes */}
            <div className="flex gap-3 mt-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07..." />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Firma */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Diseño y desarrollo por{" "}
            <a
              href="https://digitanea.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Digitanea
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
