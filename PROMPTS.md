# Prompts utilizados para generar el proyecto VanLife Rentals

## Prompt 1: Analisis inicial del proyecto

Actua como desarrollador senior full-stack. Analiza este proyecto Next.js existente antes de modificar nada. Revisa la estructura de carpetas, `package.json`, version de Next.js, configuracion de Tailwind, archivos dentro de `src/app`, estado de Git y dependencias instaladas. Despues dime que partes faltan para cumplir este enunciado:

- Landing publica con presentacion de empresa y propuesta de valor.
- Seccion de modelos de furgoneta camper con datos persistidos.
- Comentarios por modelo: usuarios autenticados pueden publicar, visitantes solo leer.
- Formulario de solicitud de informacion con validacion y persistencia.
- Next.js 16 App Router, PostgreSQL, Prisma y Auth.js.
- Roles minimos `EDITOR` y `ADMIN`.

No empieces a programar hasta entender la estructura actual.

## Prompt 2: Implementacion completa del stack

Implementa el proyecto completo usando Next.js 16 con App Router, PostgreSQL, Prisma y Auth.js. Puedes crear, editar o eliminar archivos necesarios. Usa JavaScript, no TypeScript, porque el proyecto actual esta en `.js`.

Requisitos tecnicos:

- Crear `prisma/schema.prisma` con modelos para usuarios Auth.js, sesiones, cuentas, modelos camper, comentarios y solicitudes de informacion.
- Crear roles `USER`, `EDITOR` y `ADMIN`.
- Crear conexion Prisma reutilizable en `src/lib/prisma.js`.
- Configurar Auth.js con Credentials Provider y Prisma Adapter.
- Crear ruta `src/app/api/auth/[...nextauth]/route.js`.
- Crear seed con usuarios de prueba y modelos camper iniciales.
- Crear acciones del servidor para login, comentarios, solicitudes de informacion y creacion de modelos.
- Validar formularios con Zod.
- Proteger comentarios para que solo usuarios autenticados puedan publicar.
- Proteger `/admin` para roles `EDITOR` y `ADMIN`.

Comenta en el codigo la logica importante: conexion Prisma, validaciones, autenticacion, roles y persistencia.

## Prompt 3: Diseno segun prototipo

Disena la interfaz para que se parezca mucho al prototipo adjunto de VanLife Rentals.

Estilo visual:

- Landing oscura con hero grande.
- Imagen de aventura/camper como fondo principal.
- Logo textual VanLife Rentals.
- Navegacion superior: Inici, Cataleg, Sobre nosaltres, Contacte.
- Boton destacado "Reserva ara".
- Titular grande: "La teva aventura comenca aqui".
- Paleta oscura con acento turquesa.
- Tarjetas de modelos destacados.
- Panel de opiniones de clientes.
- Panel lateral de reserva/contacto.
- Franja de ventajas: furgonetas equipadas, recogida, seguro, mejor precio.
- Diseño responsive para movil y escritorio.

No hagas una landing generica de marketing. La primera pantalla debe sentirse como una web real de alquiler de campers.

## Prompt 4: Rutas y funcionalidades

Crea estas rutas:

- `/`: landing publica con modelos destacados, comentarios recientes y formulario de solicitud.
- `/models/[slug]`: ficha individual de camper con caracteristicas, precio, comentarios y formulario de comentario si hay sesion.
- `/login`: formulario de acceso.
- `/admin`: panel protegido para `EDITOR` y `ADMIN`, con listado de modelos, solicitudes recibidas y formulario para crear modelos.

Los visitantes no autenticados deben poder leer modelos y comentarios, pero no publicar comentarios. Si intentan comentar, deben iniciar sesion.

## Prompt 5: Datos de prueba

Crea un seed de Prisma con estos usuarios:

- `client@vanlife.test`, rol `USER`.
- `editor@vanlife.test`, rol `EDITOR`.
- `admin@vanlife.test`, rol `ADMIN`.

Todos deben tener la contrasena `Password123!` hasheada con bcrypt.

Crea al menos tres campers:

- Sunlight Cliff 640.
- Volkswagen California.
- Ford Transit Custom.

Incluye caracteristicas, precio por dia, plazas, camas, descripcion, imagen y comentarios iniciales.

## Prompt 6: Variables de entorno y Supabase

Prepara `.env.example` explicando que Prisma necesita una `DATABASE_URL` de PostgreSQL. Si se usa Supabase, debe usarse una connection string que empiece por `postgresql://`, no la URL publica `https://...supabase.co`.

Incluye ejemplo:

```env
DATABASE_URL="postgresql://postgres.xxxxx:TU_PASSWORD@aws-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="tu_publishable_key"
AUTH_SECRET="cambia-este-secreto-en-produccion"
AUTH_TRUST_HOST=true
```

Explica en el README que despues de configurar `.env` hay que ejecutar:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Prompt 7: Verificacion

Verifica que el proyecto funciona.

Ejecuta:

```bash
npm run prisma:generate
npm run lint
npm run build
```

Si hay errores, corrige el codigo. Si hay warnings aceptables, explicalos. Finalmente arranca el servidor de desarrollo y comprueba que estas rutas responden:

- `/`
- `/login`
- `/models/sunlight-cliff-640`
- `/admin`

Resume los cambios realizados y cualquier paso pendiente para conectar la base de datos real.
