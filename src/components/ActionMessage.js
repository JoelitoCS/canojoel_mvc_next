"use client";

export function ActionMessage({ state }) {
  // Si la accion aun no ha devuelto estado, no se muestra ningun mensaje.
  if (!state?.message) {
    return null;
  }

  // Muestra el mensaje en verde si ok=true y en estilo de error si ok=false.
  return (
    <p className={state.ok ? "form-message form-message--ok" : "form-message"}>
      {state.message}
    </p>
  );
}
