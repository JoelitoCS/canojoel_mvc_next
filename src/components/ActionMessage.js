"use client";

export function ActionMessage({ state }) {
  if (!state?.message) {
    return null;
  }

  return (
    <p className={state.ok ? "form-message form-message--ok" : "form-message"}>
      {state.message}
    </p>
  );
}
