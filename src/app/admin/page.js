import { redirect } from "next/navigation";
import { ModelForm } from "@/components/ModelForm";
import { getAdminData } from "@/lib/data";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  // Control de acceso por rol: solo EDITOR y ADMIN entran en la zona de gestion.
  if (!["EDITOR", "ADMIN"].includes(session?.user?.role)) {
    redirect("/login");
  }

  const { models, requests } = await getAdminData();

  return (
    <main className="admin-page">
      <section>
        <p className="eyebrow">Backoffice</p>
        <h1>Gestio VanLife</h1>
        <p>
          Sessio iniciada com <strong>{session.user.email}</strong> amb rol{" "}
          <strong>{session.user.role}</strong>.
        </p>
      </section>

      <section className="admin-grid">
        <div className="panel">
          <h2>Afegir model camper</h2>
          <ModelForm />
        </div>

        <div className="panel">
          <h2>Models persistits</h2>
          <div className="admin-list">
            {models.map((model) => (
              <article key={model.id}>
                <strong>{model.name}</strong>
                <span>{model.pricePerDay} € / dia · {model.seats} places</span>
              </article>
            ))}
          </div>
        </div>

        <div className="panel requests-panel">
          <h2>Sol-licituds d&apos;informacio</h2>
          <div className="admin-list">
            {requests.length ? (
              requests.map((request) => (
                <article key={request.id}>
                  <strong>{request.fullName}</strong>
                  <span>{request.email} · {request.destination || "Sense destinacio"}</span>
                  <p>{request.message}</p>
                </article>
              ))
            ) : (
              <p className="muted">Encara no hi ha sol-licituds guardades.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
