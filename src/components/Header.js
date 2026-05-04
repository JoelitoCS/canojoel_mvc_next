import Link from "next/link";
import { Mountain, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth, signOut } from "../../auth";

export async function Header() {
  // Se lee la sesion en servidor para saber si mostrar login, logout o admin.
  const session = await auth();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="VanLife Rentals">
        <Mountain size={42} strokeWidth={1.7} />
        <span>
          <strong>VanLife</strong>
          <small>Rentals</small>
        </span>
      </Link>
      <nav>
        {/* Enlaces principales de la web, ahora separados en paginas reales. */}
        <Link href="/">Inici</Link>
        <Link href="/cataleg">Cataleg</Link>
        <Link href="/sobre-nosaltres">Sobre nosaltres</Link>
        <Link href="/contacte">Contacte</Link>
        {/* Solo los roles de backoffice ven el enlace de gestion. */}
        {["EDITOR", "ADMIN"].includes(session?.user?.role) ? (
          <Link href="/admin">Gestio</Link>
        ) : null}
      </nav>
      <div className="header-actions">
        {/* Control de tema disponible en toda la aplicacion. */}
        <ThemeToggle />
        {session?.user ? (
          // Si hay usuario, se muestra un formulario de logout con Server Action inline.
          <form
            action={async () => {
              "use server";
              // signOut borra la sesion y devuelve al usuario a la landing.
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="ghost-user" type="submit" title="Tancar sessio">
              <UserRound size={18} />
              {session.user.name || "Compte"}
            </button>
          </form>
        ) : (
          // Si no hay sesion, el CTA lleva al login.
          <Link href="/login" className="header-cta">
            Reserva ara
          </Link>
        )}
      </div>
    </header>
  );
}
