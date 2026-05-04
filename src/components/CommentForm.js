"use client";

import { useActionState } from "react";
import { createComment } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";

export function CommentForm({ model }) {
  const [state, formAction, pending] = useActionState(createComment, null);

  return (
    <form action={formAction} className="comment-form">
      <input type="hidden" name="modelId" value={model.id} />
      <input type="hidden" name="slug" value={model.slug} />
      <label>
        Puntuacion
        <select name="rating" defaultValue="5">
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </label>
      <label>
        Comentario
        <textarea
          name="content"
          rows="4"
          placeholder="Cuenta como fue tu experiencia con esta camper..."
          required
        />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Publicando..." : "Publicar comentario"}
      </button>
      <ActionMessage state={state} />
    </form>
  );
}
