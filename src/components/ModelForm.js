"use client";

import { useActionState } from "react";
import { createModel } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function ModelForm() {
  // createModel valida permisos y guarda la camper desde el servidor.
  const [state, formAction, pending] = useActionState(createModel, null);

  return (
    <form action={formAction} className="admin-form">
      {/* Datos basicos de identificacion del modelo. */}
      <div className="form-grid">
        <label>
          Nom
          <input name="name" placeholder="Mercedes Marco Polo" required />
        </label>
        <label>
          Marca
          <input name="brand" placeholder="Mercedes" required />
        </label>
      </div>
      <label>
        {/* El slug sera la URL publica /models/[slug]. */}
        Slug
        <input name="slug" placeholder="mercedes-marco-polo" required />
      </label>
      <label>
        Resum curt
        <input name="short" placeholder="Confort premium per llargues rutes" required />
      </label>
      <label>
        Descripcio
        <textarea name="description" rows="4" required />
      </label>
      <div className="form-grid">
        {/* Numeros principales que se muestran en tarjetas y ficha. */}
        <label>
          Places
          <input name="seats" type="number" min="1" defaultValue="4" required />
        </label>
        <label>
          Dormen
          <input name="sleeps" type="number" min="1" defaultValue="2" required />
        </label>
        <label>
          Preu/dia
          <input name="pricePerDay" type="number" min="1" defaultValue="130" required />
        </label>
      </div>
      <label>
        URL imatge
        <input name="imageUrl" type="url" placeholder="https://..." required />
      </label>
      <label>
        {/* Las caracteristicas se escriben separadas por comas y se guardan como array. */}
        Caracteristiques
        <input name="features" placeholder="Cuina, Ducha, GPS" required />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {/* Mientras pending=true evitamos crear el mismo modelo dos veces. */}
        {pending ? "Guardant..." : "Afegir model"}
      </button>
      {/* Respuesta de validacion/permisos devuelta por createModel. */}
      <ActionMessage state={state} />
    </form>
  );
}
