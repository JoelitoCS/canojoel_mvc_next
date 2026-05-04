import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { auth } from "../../../auth";

export default async function LoginPage() {
  // Si ya hay sesion activa, no tiene sentido mostrar de nuevo el login.
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        {/* Tarjeta de acceso con credenciales demo generadas por el seed. */}
        <p className="eyebrow">Acces privat</p>
        <h1>Entra al teu compte</h1>
        <p>
          Usa els comptes del seed: <strong>client@vanlife.test</strong>,{" "}
          <strong>editor@vanlife.test</strong> o <strong>admin@vanlife.test</strong>.
          La contrasena es <strong>Password123!</strong>.
        </p>
        {/* Client Component que invoca loginAction. */}
        <LoginForm />
      </section>
    </main>
  );
}
