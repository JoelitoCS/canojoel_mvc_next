"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Marca que el componente ya está montado en el cliente
    setMounted(true);

    // Lee el tema guardado
    const saved = localStorage.getItem("vanlife-theme") || "dark";
    setTheme(saved);

    // Aplica el tema al html
    document.documentElement.dataset.theme = saved;
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vanlife-theme", theme);
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // Evita renderizar iconos antes de montar → evita hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Cambiar tema"
        className="icon-button"
        type="button"
      >
        {/* placeholder sin icono */}
      </button>
    );
  }

  return (
    <button
      aria-label="Cambiar tema"
      className="icon-button"
      onClick={toggleTheme}
      title="Cambiar tema"
      type="button"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
