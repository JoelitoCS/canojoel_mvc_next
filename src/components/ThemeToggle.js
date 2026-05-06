"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  // Estado inicial compatible con servidor; en cliente se recalcula desde localStorage.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return localStorage.getItem("vanlife-theme") || "dark";
  });

  useEffect(() => {
    // Sincroniza el atributo global que activa las variables CSS de claro/oscuro.
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vanlife-theme", theme);
  }, [theme]);

  function toggleTheme() {
    // Alterna entre tema claro y oscuro desde cualquier pagina.
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  return (
    <button
      aria-label="Cambiar tema"
      className="icon-button"
      onClick={toggleTheme}
      suppressHydrationWarning
      title="Cambiar tema"
      type="button"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
