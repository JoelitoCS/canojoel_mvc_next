"use client";

import { useActionState } from "react";
import { createModel } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function ModelForm() {
  const [state, formAction, pending] = useActionState(createModel, null);

  return (
    <form action={formAction} className="admin-form">
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
        Caracteristiques
        <input name="features" placeholder="Cuina, Ducha, GPS" required />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Guardant..." : "Afegir model"}
      </button>
      <ActionMessage state={state} />
    </form>
  );
}
