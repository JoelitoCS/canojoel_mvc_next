# VanLife Rentals

Projecte Next.js 16 amb App Router, PostgreSQL, Prisma i Auth.js. Inclou landing publica, cataleg de campers persistit, comentaris protegits per autenticacio, formulari de sol-licitud d'informacio i gestio de rols `USER`, `EDITOR` i `ADMIN`.

## Posada en marxa

1. Configura PostgreSQL/Supabase i revisa `DATABASE_URL` i `DIRECT_URL` a `.env`. Les variables `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no substitueixen `DATABASE_URL`; Prisma necessita la connection string PostgreSQL.
2. Genera Prisma:

```bash
npm run prisma:generate
```

3. Aplica migracions:

```bash
npm run prisma:migrate
```

4. Carrega dades de prova:

```bash
npm run prisma:seed
```

5. Arrenca Next.js:

```bash
npm run dev
```

## Usuaris de prova

Tots fan servir la contrasenya `Password123!`.

- `client@vanlife.test`: pot publicar comentaris.
- `editor@vanlife.test`: pot entrar a `/admin` i crear models.
- `admin@vanlife.test`: rol administratiu complet.

## Rutes principals

- `/`: landing publica, models destacats, opinions i formulari de contacte.
- `/models/[slug]`: fitxa del model i comentaris.
- `/login`: autenticacio amb Auth.js Credentials.
- `/admin`: zona protegida per `EDITOR` i `ADMIN`.
