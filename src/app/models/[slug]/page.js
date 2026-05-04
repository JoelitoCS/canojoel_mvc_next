import Link from "next/link";
import { notFound } from "next/navigation";
import { CarFront, ShieldCheck, Star, UsersRound } from "lucide-react";
import { auth } from "../../../../auth";
import { CommentForm } from "@/components/CommentForm";
import { getModelBySlug } from "@/lib/data";

// La ficha debe ser dinamica porque depende del slug y de comentarios actuales.
export const dynamic = "force-dynamic";

function Stars({ rating }) {
  // Renderiza estrellas visuales a partir del rating guardado en la base de datos.
  return (
    <span className="stars">
      {Array.from({ length: rating }).map((_, index) => (
        <Star key={index} size={15} fill="currentColor" />
      ))}
    </span>
  );
}

export default async function ModelDetailPage({ params }) {
  // En Next 16 params es una Promise en paginas dinamicas.
  const { slug } = await params;
  // Carga en paralelo el modelo y la sesion para reducir tiempo de espera.
  const [model, session] = await Promise.all([getModelBySlug(slug), auth()]);

  if (!model) {
    // Si no existe el slug, Next renderiza la pagina 404.
    notFound();
  }

  return (
    <main className="detail-page">
      <section className="detail-hero">
        {/* Imagen y resumen principal de la camper. */}
        <img src={model.imageUrl} alt={model.name} />
        <div>
          <Link href="/" className="back-link">Tornar al cataleg</Link>
          <p className="eyebrow">{model.brand}</p>
          <h1>{model.name}</h1>
          <p>{model.description}</p>
          <div className="detail-stats">
            <span><UsersRound size={20} /> {model.seats} places</span>
            <span><CarFront size={20} /> {model.sleeps} dormen</span>
            <span><ShieldCheck size={20} /> Assistencia 24/7</span>
          </div>
          <strong className="detail-price">{model.pricePerDay} € <small>/ dia</small></strong>
        </div>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <h2>Caracteristiques</h2>
          <ul className="feature-list">
            {/* Caracteristicas persistidas como array en PostgreSQL. */}
            {model.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2>Comentaris</h2>
          {/* Los visitantes pueden leer todos los comentarios. */}
          {model.comments?.length ? (
            model.comments.map((comment) => (
              <article className="comment" key={comment.id}>
                <strong>{comment.user?.name || "Viatger"}</strong>
                <Stars rating={comment.rating} />
                <p>{comment.content}</p>
              </article>
            ))
          ) : (
            <p className="muted">Encara no hi ha comentaris per aquest model.</p>
          )}

          {/* Solo los usuarios autenticados ven el formulario para publicar. */}
          {session?.user ? (
            <CommentForm model={model} />
          ) : (
            <p className="login-note">
              Els visitants poden llegir opinions. Per publicar-ne una,{" "}
              <Link href="/login">inicia sessio</Link>.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
