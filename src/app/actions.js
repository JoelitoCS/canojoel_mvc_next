"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn } from "../../auth";
import { prisma } from "@/lib/prisma";

// Valida los comentarios antes de guardarlos: modelo, slug, rating y texto.
const commentSchema = z.object({
  modelId: z.string().min(1),
  slug: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  content: z.string().trim().min(10, "Escribe al menos 10 caracteres."),
});

// Valida el formulario publico de contacto/reserva.
const requestSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  pickupDate: z.string().optional(),
  returnDate: z.string().optional(),
  destination: z.string().trim().optional(),
  message: z.string().trim().min(15),
});

// Valida el formulario interno para crear nuevos modelos camper desde /admin.
const modelSchema = z.object({
  name: z.string().trim().min(3),
  brand: z.string().trim().min(2),
  slug: z.string().trim().min(3).regex(/^[a-z0-9-]+$/),
  short: z.string().trim().min(8),
  description: z.string().trim().min(20),
  seats: z.coerce.number().int().min(1).max(9),
  sleeps: z.coerce.number().int().min(1).max(9),
  pricePerDay: z.coerce.number().int().min(1),
  imageUrl: z.string().trim().url(),
  features: z.string().trim().min(3),
});

// Para editar/eliminar se necesita identificar el registro existente.
const modelIdSchema = z.object({
  id: z.string().min(1),
});

function parseDate(value) {
  // Los inputs date envian una cadena vacia cuando no hay fecha; Prisma debe
  // recibir null o Date, nunca una cadena vacia.
  return value ? new Date(value) : null;
}

function requireBackofficeRole(session) {
  // Centraliza el permiso de backoffice para no repetir la lista de roles.
  return ["EDITOR", "ADMIN"].includes(session?.user?.role);
}

export async function loginAction(_previousState, formData) {
  // Extrae los campos del formulario de login recibido desde el Client Component.
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  try {
    // Auth.js hace la verificacion real en auth.js/authorize. Aqui solo
    // entregamos los datos del formulario y dejamos que redirija si es valido.
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Email o contrasena incorrectos." };
    }

    throw error;
  }
}

export async function createComment(_previousState, formData) {
  // auth() lee la sesion en servidor; sin usuario no se permite publicar.
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "Inicia sesion para publicar comentarios." };
  }

  // Object.fromEntries transforma FormData en objeto para que Zod pueda validarlo.
  const parsed = commentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  // Persistencia del comentario asociado al modelo y al usuario autenticado.
  await prisma.comment.create({
    data: {
      modelId: parsed.data.modelId,
      userId: session.user.id,
      rating: parsed.data.rating,
      content: parsed.data.content,
    },
  });

  // Revalida la landing y la ficha para mostrar el comentario nuevo.
  revalidatePath("/");
  revalidatePath(`/models/${parsed.data.slug}`);
  return { ok: true, message: "Comentario publicado. Gracias por compartir tu ruta." };
}

export async function submitInfoRequest(_previousState, formData) {
  // Valida datos del formulario publico antes de tocar la base de datos.
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa nombre, email y mensaje. Son campos obligatorios.",
    };
  }

  // Guarda la solicitud de informacion para que se vea despues en /admin.
  await prisma.infoRequest.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      pickupDate: parseDate(parsed.data.pickupDate),
      returnDate: parseDate(parsed.data.returnDate),
      destination: parsed.data.destination || null,
      message: parsed.data.message,
    },
  });

  // Actualiza el panel de administracion despues de guardar la solicitud.
  revalidatePath("/admin");
  return { ok: true, message: "Solicitud recibida. Te contactaremos muy pronto." };
}

export async function createModel(_previousState, formData) {
  // El alta de modelos solo puede ejecutarla un usuario con rol EDITOR o ADMIN.
  const session = await auth();

  if (!requireBackofficeRole(session)) {
    return { ok: false, message: "No tienes permisos para gestionar modelos." };
  }

  // Validacion estricta del modelo: slug limpio, numeros y URL de imagen.
  const parsed = modelSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  // Convierte el input de caracteristicas separado por comas en array PostgreSQL.
  await prisma.camperModel.create({
    data: {
      ...parsed.data,
      features: parsed.data.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      highlighted: true,
    },
  });

  // Revalida las paginas que muestran el catalogo y vuelve al panel.
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateModel(_previousState, formData) {
  // La edicion completa del modelo tambien esta limitada a EDITOR y ADMIN.
  const session = await auth();

  if (!requireBackofficeRole(session)) {
    return { ok: false, message: "No tienes permisos para editar modelos." };
  }

  // Se validan juntos el id y todos los campos editables, incluida la imagen.
  const parsed = modelSchema.merge(modelIdSchema).safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { id, features, ...modelData } = parsed.data;

  try {
    // Actualiza todos los campos visibles en catalogo/ficha y transforma features a array.
    await prisma.camperModel.update({
      where: { id },
      data: {
        ...modelData,
        features: features
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
      },
    });
  } catch {
    return { ok: false, message: "No se ha podido editar el modelo. Revisa que el slug no exista ya." };
  }

  // Revalida las paginas publicas y el panel para reflejar el cambio.
  revalidatePath("/");
  revalidatePath("/cataleg");
  revalidatePath(`/models/${parsed.data.slug}`);
  revalidatePath("/admin");
  return { ok: true, message: "Modelo actualizado correctamente." };
}

export async function deleteModel(_previousState, formData) {
  // Borrar modelos es una accion sensible: solo EDITOR y ADMIN.
  const session = await auth();

  if (!requireBackofficeRole(session)) {
    return { ok: false, message: "No tienes permisos para eliminar modelos." };
  }

  const parsed = modelIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: "No se ha recibido el modelo a eliminar." };
  }

  try {
    // La relacion Comment tiene onDelete: Cascade, asi que los comentarios se eliminan con el modelo.
    await prisma.camperModel.delete({
      where: { id: parsed.data.id },
    });
  } catch {
    return { ok: false, message: "No se ha podido eliminar el modelo." };
  }

  revalidatePath("/");
  revalidatePath("/cataleg");
  revalidatePath("/admin");
  return { ok: true, message: "Modelo eliminado correctamente." };
}
