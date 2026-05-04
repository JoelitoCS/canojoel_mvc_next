"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  // Lee el tema guardado al inicializar el estado del componente cliente.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return localStorage.getItem("vanlife-theme") || "dark";
  });

  useEffect(() => {
    // Sincroniza el atributo del html cada vez que cambia el estado de tema.
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    // Alterna el tema, lo aplica al html y lo persiste para futuras visitas.
    const nextTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("vanlife-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      aria-label="Canviar tema"
      className="icon-button"
      onClick={toggleTheme}
      title="Canviar tema"
      type="button"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
