"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function LoginForm() {
  // loginAction llama a Auth.js en el servidor y devuelve errores al formulario.
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="auth-form">
      {/* Email y contrasena coinciden con usuarios creados por prisma/seed.js. */}
      <label>
        Email
        <input name="email" type="email" placeholder="client@vanlife.test" required />
      </label>
      <label>
        Contrasena
        <input name="password" type="password" placeholder="Password123!" required />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {/* pending deshabilita el boton durante la autenticacion. */}
        {pending ? "Entrando..." : "Entrar"}
      </button>
      {/* Muestra "Email o contrasena incorrectos" si Auth.js rechaza el login. */}
      <ActionMessage state={state} />
    </form>
  );
}
