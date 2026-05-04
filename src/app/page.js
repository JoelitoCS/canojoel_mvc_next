import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import { ModelCard } from "@/components/ModelCard";
import { getHighlightedModels } from "@/lib/data";

// Fuerza render dinamico porque la pagina lee datos de Prisma en cada request.
export const dynamic = "force-dynamic";

function Stars({ rating = 5 }) {
  // Genera tantos iconos de estrella como indique el rating.
  return (
    <span className="stars" aria-label={`${rating} de 5`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star key={index} size={15} fill="currentColor" />
      ))}
    </span>
  );
}

function Feature({ icon: Icon, title, text }) {
  // Componente reutilizable para los beneficios de la landing.
  return (
    <article className="feature">
      <Icon size={26} />
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

export default async function Home() {
  // Carga modelos destacados desde Supabase/PostgreSQL mediante Prisma.
  const models = await getHighlightedModels();
  // Extrae como maximo tres comentarios recientes para el panel de opiniones.
  const comments = models.flatMap((model) => model.comments || []).slice(0, 3);

  return (
    <main>
      <section className="home-hero">
        {/* Hero principal con imagen real, mensaje directo y CTAs claros. */}
        <div className="home-hero__content reveal">
          <p className="eyebrow"><Sparkles size={16} /> Camper premium rental</p>
          <h1>
            Llibertat de ruta, confort de casa.
          </h1>
          <p>
            Furgonetes camper equipades, verificades i preparades per viatges sense friccio.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/cataleg">
              Veure cataleg <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/contacte">
              Demanar informacio
            </Link>
          </div>
          <div className="trust-row">
            <span>Excel-lent</span>
            <Stars />
            <strong>4.8/5 a Trustpilot</strong>
          </div>
        </div>
        <div className="hero-booking-preview reveal reveal--delay">
          <span>Disponibilitat</span>
          <strong>Escapades de 2 a 21 dies</strong>
          <p>Recollida flexible, assistencia 24/7 i asseguranca inclosa.</p>
        </div>
      </section>

      <section className="section-shell benefits-grid">
        {/* Ventajas rapidas del servicio de alquiler. */}
        <Feature icon={CarFront} title="Vehicles verificats" text="Neteja, revisio i equip complet abans de cada sortida." />
        <Feature icon={MapPin} title="Recollida senzilla" text="Punts clars de lliurament i retorn sense esperes." />
        <Feature icon={ShieldCheck} title="Cobertura inclosa" text="Asseguranca i assistencia local tots els dies." />
        <Feature icon={ThumbsUp} title="Preu transparent" text="Sense costos amagats ni lletra petita." />
      </section>

      <section className="section-shell split-section">
        {/* Bloque editorial que da credibilidad a la empresa. */}
        <div>
          <p className="eyebrow">Servei professional</p>
          <h2>Preparat per conduir, dormir i viure el trajecte.</h2>
        </div>
        <p>
          Cada camper es lliura amb inventari revisat, autonomia energetica, cuina equipada i suport durant tota la ruta.
        </p>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cataleg</p>
            <h2>Models destacats</h2>
          </div>
          <Link className="text-link" href="/cataleg">
            Veure tots <ArrowRight size={17} />
          </Link>
        </div>
        <div className="model-cards model-cards--home">
          {/* Cada tarjeta enlaza a la ficha dinamica del modelo. */}
          {models.slice(0, 3).map((model) => (
            <ModelCard featured key={model.slug} model={model} />
          ))}
        </div>
      </section>

      <section className="section-shell evidence-grid">
        <div className="panel">
          <p className="eyebrow">Opinions</p>
          <h2>Clients que tornen a reservar</h2>
          {/* Si hay comentarios persistidos se muestran; si no, se avisa del seed. */}
          {comments.length ? (
            <div className="review-list">
              {comments.map((comment) => (
                <article className="review" key={comment.id}>
                  <div className="avatar">{comment.user?.name?.charAt(0) || "V"}</div>
                  <div>
                    <strong>{comment.user?.name || "Viatger"}</strong>
                    <Stars rating={comment.rating} />
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">Encara no hi ha opinions persistides. Executa el seed per carregar-ne.</p>
          )}
        </div>
        <div className="panel stats-panel">
          <span><CalendarCheck size={22} /> Cancel-lacio flexible</span>
          <span><ShieldCheck size={22} /> Pagament segur</span>
          <span><MapPin size={22} /> Suport local 24/7</span>
        </div>
      </section>
    </main>
  );
}
