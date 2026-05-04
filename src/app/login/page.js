import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { auth } from "../../../auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Acces privat</p>
        <h1>Entra al teu compte</h1>
        <p>
          Usa els comptes del seed: <strong>client@vanlife.test</strong>,{" "}
          <strong>editor@vanlife.test</strong> o <strong>admin@vanlife.test</strong>.
          La contrasena es <strong>Password123!</strong>.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
