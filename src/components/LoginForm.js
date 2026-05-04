"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="auth-form">
      <label>
        Email
        <input name="email" type="email" placeholder="client@vanlife.test" required />
      </label>
      <label>
        Contrasena
        <input name="password" type="password" placeholder="Password123!" required />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
      <ActionMessage state={state} />
    </form>
  );
}
