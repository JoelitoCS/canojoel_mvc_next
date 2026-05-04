import { PrismaClient } from "@prisma/client";

// En desarrollo Next.js recarga modulos con frecuencia. Guardar el cliente en
// global evita abrir una conexion nueva a PostgreSQL en cada refresco.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
