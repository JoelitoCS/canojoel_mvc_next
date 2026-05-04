import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Esquema minimo para validar las credenciales antes de consultar la base de datos.
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// NextAuth exporta handlers para la ruta API, auth para leer sesion en servidor
// y signIn/signOut para ejecutar login/logout desde acciones del servidor.
export const { handlers, auth, signIn, signOut } = NextAuth({
  // PrismaAdapter hace que Auth.js guarde usuarios, cuentas y sesiones en PostgreSQL.
  adapter: PrismaAdapter(prisma),
  // Se usa JWT para que el rol pueda viajar en el token de sesion.
  session: { strategy: "jwt" },
  // Ruta personalizada del formulario de login.
  pages: {
    signIn: "/login",
  },
  // Provider de credenciales: login con email y contrasena guardada en la tabla User.
  providers: [
    Credentials({
      // authorize concentra la logica de login: valida el formulario,
      // busca el usuario en PostgreSQL y compara la contrasena hasheada.
      async authorize(rawCredentials) {
        // safeParse evita lanzar excepciones si el formulario llega incompleto.
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        // El email se normaliza a minusculas para que coincida con el seed y registros.
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        // Si no hay usuario o no tiene password, Auth.js rechaza el login.
        if (!user?.password) {
          return null;
        }

        // bcrypt compara la contrasena enviada con el hash guardado en PostgreSQL.
        const isValid = await bcrypt.compare(parsed.data.password, user.password);

        if (!isValid) {
          return null;
        }

        // Estos campos pasan al callback jwt y despues a session.user.
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // El rol viaja dentro del token para no consultar la base de datos en cada
    // render. Auth.js lo expone despues dentro de session.user.role.
    async jwt({ token, user }) {
      // user solo existe en el momento del login; despues el token ya conserva los datos.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Se copian id y role a la sesion para usarlos en componentes y guards.
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
