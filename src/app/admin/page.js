import { redirect } from "next/navigation";
import { ModelEditForm } from "@/components/ModelEditForm";
import { ModelForm } from "@/components/ModelForm";
import { getAdminData } from "@/lib/data";
import { auth } from "../../../auth";

// La administracion siempre debe leer datos frescos de la base de datos.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Lee la sesion para comprobar permisos antes de mostrar datos internos.
  const session = await auth();

  // Control de acceso por rol: solo EDITOR y ADMIN entran en la zona de gestion.
  if (!["EDITOR", "ADMIN"].includes(session?.user?.role)) {
    redirect("/login");
  }

  // Carga modelos y solicitudes desde Prisma para el panel.
  const { models, requests } = await getAdminData();

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Backoffice</p>
          <h1>Gestio VanLife</h1>
          <p>
            Sessio iniciada com <strong>{session.user.email}</strong> amb rol{" "}
            <strong>{session.user.role}</strong>.
          </p>
        </div>

        <div className="admin-summary">
          <span><strong>{models.length}</strong> Models</span>
          <span><strong>{requests.length}</strong> Sol-licituds</span>
          <span><strong>{session.user.role}</strong> Rol actiu</span>
        </div>
      </section>

      <section className="admin-dashboard">
        <div className="panel admin-create-panel">
          <details className="admin-create-disclosure">
            <summary className="admin-panel-heading admin-panel-heading--summary">
              <div>
                <p className="eyebrow">Alta de vehicle</p>
                <h2>Afegir model camper</h2>
              </div>
              <span>Obrir formulari</span>
            </summary>
            {/* Formulario protegido que crea CamperModel en PostgreSQL. */}
            <ModelForm />
          </details>
        </div>

        <div className="panel model-editor-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Cataleg</p>
              <h2>Editar o eliminar models</h2>
            </div>
            <span>{models.length} registres persistits</span>
          </div>

          <div className="model-editor-list">
            {/* Cada modelo tiene edicion completa y borrado protegido por rol. */}
            {models.map((model) => (
              <ModelEditForm key={model.id} model={model} />
            ))}
          </div>
        </div>

        <div className="panel requests-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Contacte</p>
              <h2>Sol-licituds d&apos;informacio</h2>
            </div>
            <span>{requests.length} entrades</span>
          </div>

          <div className="admin-list">
            {/* Solicitudes enviadas desde el formulario publico de contacto. */}
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
