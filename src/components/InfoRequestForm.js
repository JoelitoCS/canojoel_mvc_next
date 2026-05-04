"use client";

import { useActionState } from "react";
import { submitInfoRequest } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function InfoRequestForm() {
  // Ejecuta submitInfoRequest sin crear una API manual: React envia el FormData al servidor.
  const [state, formAction, pending] = useActionState(submitInfoRequest, null);

  return (
    <form action={formAction} className="booking-form">
      {/* Datos personales minimos para poder contactar con el cliente. */}
      <label>
        Nom complet
        <input name="fullName" placeholder="El teu nom" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="tu@email.com" required />
      </label>
      <label>
        Telefon
        <input name="phone" type="tel" placeholder="+34 600 000 000" />
      </label>
      <div className="form-grid">
        {/* Fechas opcionales que parseDate convertira a Date o null. */}
        <label>
          Recollida
          <input name="pickupDate" type="date" />
        </label>
        <label>
          Retorn
          <input name="returnDate" type="date" />
        </label>
      </div>
      <label>
        Destinacio
        <input name="destination" placeholder="Pirineus, Noruega, Costa Brava..." />
      </label>
      <label>
        Missatge
        <textarea name="message" rows="4" placeholder="Explica'ns quin viatge tens al cap" required />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {/* Cambia el texto mientras se esta guardando la solicitud. */}
        {pending ? "Enviant..." : "Comprova disponibilitat"}
      </button>
      {/* Feedback de validacion o confirmacion. */}
      <ActionMessage state={state} />
    </form>
  );
}
