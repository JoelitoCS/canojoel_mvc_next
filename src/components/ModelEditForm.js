"use client";

import { useActionState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { deleteModel, updateModel } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function ModelEditForm({ model }) {
  // Un estado controla la edicion y otro la eliminacion para mostrar feedback independiente.
  const [updateState, updateAction, updatePending] = useActionState(updateModel, null);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteModel, null);

  function confirmDelete(event) {
    // Confirmacion en cliente para evitar borrados accidentales desde el panel.
    if (!window.confirm(`Eliminar ${model.name}? Esta accion no se puede deshacer.`)) {
      event.preventDefault();
    }
  }

  return (
    <article className="model-editor model-editor--compact">
      <div className="model-editor__row">
        <details className="model-editor__details">
          <summary className="model-editor__summary">
            <span className="model-editor__preview">
              <img src={model.imageUrl} alt={model.name} />
              <span>
                <span className="model-editor__brand">{model.brand}</span>
                <strong>{model.name}</strong>
                <span className="model-editor__meta">{model.slug}</span>
              </span>
            </span>
            <span className="model-editor__quick">
              <span>{model.pricePerDay} € / dia</span>
              <span>{model.seats} places</span>
              <span>{model.sleeps} dormen</span>
            </span>
            <span className="model-editor__toggle">
              Editar <ChevronDown size={17} />
            </span>
          </summary>

          <form action={updateAction} className="admin-form model-editor__form">
            <input type="hidden" name="id" value={model.id} />
            <div className="form-grid">
              <label>
                Nom
                <input name="name" defaultValue={model.name} required />
              </label>
              <label>
                Marca
                <input name="brand" defaultValue={model.brand} required />
              </label>
              <label>
                Slug
                <input name="slug" defaultValue={model.slug} required />
              </label>
            </div>
            <label>
              Resum curt
              <input name="short" defaultValue={model.short} required />
            </label>
            <label>
              Descripcio
              <textarea name="description" defaultValue={model.description} rows="3" required />
            </label>
            <div className="form-grid">
              <label>
                Places
                <input name="seats" type="number" min="1" defaultValue={model.seats} required />
              </label>
              <label>
                Dormen
                <input name="sleeps" type="number" min="1" defaultValue={model.sleeps} required />
              </label>
              <label>
                Preu/dia
                <input name="pricePerDay" type="number" min="1" defaultValue={model.pricePerDay} required />
              </label>
            </div>
            <label>
              URL imatge
              <input name="imageUrl" type="url" defaultValue={model.imageUrl} required />
            </label>
            <label>
              Caracteristiques
              <input name="features" defaultValue={model.features.join(", ")} required />
            </label>
            <div className="model-editor__actions">
              <button className="primary-button" type="submit" disabled={updatePending}>
                {updatePending ? "Guardant..." : "Guardar canvis"}
              </button>
              <ActionMessage state={updateState} />
            </div>
          </form>
        </details>

        <form action={deleteAction} className="model-editor__delete" onSubmit={confirmDelete}>
          <input type="hidden" name="id" value={model.id} />
          <button className="danger-button" type="submit" disabled={deletePending}>
            <Trash2 size={17} />
            {deletePending ? "Eliminant..." : "Eliminar"}
          </button>
          <ActionMessage state={deleteState} />
        </form>
      </div>
    </article>
  );
}
