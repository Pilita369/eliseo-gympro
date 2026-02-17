import { useEffect, useRef, ReactNode } from "react";

// Hook para animar elementos al entrar en viewport
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const el = ref.current;
    if (el) {
      const children = el.querySelectorAll(".animate-on-scroll");
      children.forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

// Wrapper para secciones con animación
export function AnimatedSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
