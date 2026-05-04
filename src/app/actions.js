"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn } from "../../auth";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  modelId: z.string().min(1),
  slug: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  content: z.string().trim().min(10, "Escribe al menos 10 caracteres."),
});

const requestSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  pickupDate: z.string().optional(),
  returnDate: z.string().optional(),
  destination: z.string().trim().optional(),
  message: z.string().trim().min(15),
});

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

function parseDate(value) {
  // Los inputs date envian una cadena vacia cuando no hay fecha; Prisma debe
  // recibir null o Date, nunca una cadena vacia.
  return value ? new Date(value) : null;
}

function requireBackofficeRole(session) {
  return ["EDITOR", "ADMIN"].includes(session?.user?.role);
}

export async function loginAction(_previousState, formData) {
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
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "Inicia sesion para publicar comentarios." };
  }

  const parsed = commentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  await prisma.comment.create({
    data: {
      modelId: parsed.data.modelId,
      userId: session.user.id,
      rating: parsed.data.rating,
      content: parsed.data.content,
    },
  });

  revalidatePath("/");
  revalidatePath(`/models/${parsed.data.slug}`);
  return { ok: true, message: "Comentario publicado. Gracias por compartir tu ruta." };
}

export async function submitInfoRequest(_previousState, formData) {
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa nombre, email y mensaje. Son campos obligatorios.",
    };
  }

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

  revalidatePath("/admin");
  return { ok: true, message: "Solicitud recibida. Te contactaremos muy pronto." };
}

export async function createModel(_previousState, formData) {
  const session = await auth();

  if (!requireBackofficeRole(session)) {
    return { ok: false, message: "No tienes permisos para gestionar modelos." };
  }

  const parsed = modelSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

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

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
