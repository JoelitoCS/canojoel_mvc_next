import { PrismaClient } from "@prisma/client";

// En desarrollo Next.js recarga modulos con frecuencia. Guardar el cliente en
// global evita abrir una conexion nueva a PostgreSQL en cada refresco.
const globalForPrisma = globalThis;

// Crea un unico PrismaClient reutilizable para todas las consultas del servidor.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // En desarrollo se muestran avisos/errores utiles; en produccion solo errores.
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  // Guarda el cliente en globalThis para sobrevivir a hot reloads de Next.js.
  globalForPrisma.prisma = prisma;
}
