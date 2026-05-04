import { prisma } from "@/lib/prisma";

// Datos de respaldo para que la landing pueda renderizar aunque la base de datos
// este apagada o aun no se hayan ejecutado las migraciones.
export const fallbackModels = [
  {
    id: "fallback-sunlight",
    slug: "sunlight-cliff-640",
    name: "Sunlight Cliff 640",
    brand: "Sunlight",
    short: "Gran autonomia para rutas largas",
    description:
      "Camper totalmente equipada con cocina, cama doble, calefaccion estacionaria y espacio amplio para viajar sin depender de hoteles.",
    seats: 4,
    sleeps: 4,
    pricePerDay: 120,
    highlighted: true,
    imageUrl:
      "https://images.unsplash.com/photo-1515876305430-f06edab8282a?auto=format&fit=crop&w=1100&q=80",
    features: ["Cocina", "Ducha", "WC", "Parking heater", "GPS"],
    comments: [],
  },
  {
    id: "fallback-california",
    slug: "volkswagen-california",
    name: "Volkswagen California",
    brand: "Volkswagen",
    short: "Compacta y agil para escapadas",
    description:
      "Una camper iconica, facil de conducir y con techo elevable. Perfecta para parejas o familias que priorizan flexibilidad.",
    seats: 4,
    sleeps: 4,
    pricePerDay: 150,
    highlighted: true,
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1100&q=80",
    features: ["Cocina", "Ducha exterior", "WC portatil", "Toldo", "HVAC"],
    comments: [],
  },
  {
    id: "fallback-transit",
    slug: "ford-transit-custom",
    name: "Ford Transit Custom",
    brand: "Ford",
    short: "Practica para viajes activos",
    description:
      "Modelo versatil con consumo ajustado, almacenaje optimizado y equipamiento esencial para escapadas deportivas.",
    seats: 4,
    sleeps: 2,
    pricePerDay: 110,
    highlighted: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80",
    features: ["Cocina", "Frigorifico", "WC", "Bluetooth", "GPS"],
    comments: [],
  },
];

export async function getHighlightedModels() {
  try {
    // Lee los modelos destacados desde PostgreSQL e incluye comentarios con usuario.
    return await prisma.camperModel.findMany({
      where: { highlighted: true },
      include: { comments: { include: { user: true }, orderBy: { createdAt: "desc" } } },
      orderBy: { pricePerDay: "asc" },
    });
  } catch {
    // Si PostgreSQL aun no esta levantado, la UI sigue renderizando con datos
    // de muestra y el proyecto puede compilarse sin bloquear al equipo.
    return fallbackModels;
  }
}

export async function getAllModels() {
  try {
    // Recupera todo el catalogo ordenado por precio para la pagina /cataleg.
    return await prisma.camperModel.findMany({
      include: { comments: { include: { user: true }, orderBy: { createdAt: "desc" } } },
      orderBy: [{ highlighted: "desc" }, { pricePerDay: "asc" }],
    });
  } catch {
    // Si la base de datos falla, el catalogo mantiene contenido visible.
    return fallbackModels;
  }
}

export async function getModelBySlug(slug) {
  try {
    // Busca una ficha concreta por slug para la ruta dinamica /models/[slug].
    return await prisma.camperModel.findUnique({
      where: { slug },
      include: {
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {
    // Si Prisma falla, intenta resolver la ficha desde los datos de respaldo.
    return fallbackModels.find((model) => model.slug === slug) || null;
  }
}

export async function getAdminData() {
  try {
    // Carga en paralelo modelos y solicitudes para reducir tiempo de espera en /admin.
    const [models, requests] = await Promise.all([
      prisma.camperModel.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.infoRequest.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return { models, requests };
  } catch {
    // El panel no se rompe si la base de datos aun no responde.
    return { models: fallbackModels, requests: [] };
  }
}
