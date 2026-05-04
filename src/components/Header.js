import Link from "next/link";
import { Mountain, UserRound } from "lucide-react";
import { auth, signOut } from "../../auth";

export async function Header() {
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
        <Link href="/#inici">Inici</Link>
        <Link href="/#models">Cataleg</Link>
        <Link href="/#sobre">Sobre nosaltres</Link>
        <Link href="/#contacte">Contacte</Link>
        {["EDITOR", "ADMIN"].includes(session?.user?.role) ? (
          <Link href="/admin">Gestio</Link>
        ) : null}
      </nav>
      {session?.user ? (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="ghost-user" type="submit" title="Tancar sessio">
            <UserRound size={18} />
            {session.user.name || "Compte"}
          </button>
        </form>
      ) : (
        <Link href="/login" className="header-cta">
          Reserva ara
        </Link>
      )}
    </header>
  );
}
