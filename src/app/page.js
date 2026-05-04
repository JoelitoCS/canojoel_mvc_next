import Link from "next/link";
import {
  CalendarCheck,
  CarFront,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { InfoRequestForm } from "@/components/InfoRequestForm";
import { getHighlightedModels } from "@/lib/data";

export const dynamic = "force-dynamic";

function Stars({ rating = 5 }) {
  return (
    <span className="stars" aria-label={`${rating} de 5`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star key={index} size={15} fill="currentColor" />
      ))}
    </span>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <article className="feature">
      <Icon size={34} />
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

export default async function Home() {
  const models = await getHighlightedModels();
  const comments = models.flatMap((model) => model.comments || []).slice(0, 3);

  return (
    <main>
      <section id="inici" className="hero">
        <div className="hero-copy">
          <h1>
            La teva aventura <span>comenca aqui</span>
          </h1>
          <p>Furgonetes camper totalment equipades per viure experiencies inoblidables.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#models">
              Descobreix els models
            </a>
            <button className="video-button" type="button">
              <PlayCircle size={25} />
              Veure video
            </button>
          </div>
          <div className="trustpilot">
            <span>Excel-lent</span>
            <Stars />
            <strong>4.8/5 a Trustpilot</strong>
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Avantatges del servei">
        <Feature icon={CarFront} title="Furgonetes" text="totalment equipades" />
        <Feature icon={MapPin} title="Recull i retorna" text="sense complicacions" />
        <Feature icon={ShieldCheck} title="Asseguranca" text="i assistencia 24/7" />
        <Feature icon={ThumbsUp} title="Millor preu" text="garantit" />
      </section>

      <section className="device-showcase" id="sobre">
        <div className="laptop-frame">
          <div className="mini-page">
            <p>VanLife Rentals</p>
            <h2>Viu mes. Preocupa&apos;t de menys.</h2>
            <span>Tot el que necessites per al teu viatge esta dins de la nostra furgoneta.</span>
          </div>
        </div>
      </section>

      <section id="models" className="dashboard-grid">
        <div className="panel models-panel">
          <div className="panel-title">
            <h2>Models destacats</h2>
            <a href="#models">Veure tots els models</a>
          </div>
          <div className="model-cards">
            {models.map((model) => (
              <Link href={`/models/${model.slug}`} className="model-card" key={model.slug}>
                <img src={model.imageUrl} alt={model.name} />
                <h3>{model.name}</h3>
                <div className="model-meta">
                  <span>{model.seats} places</span>
                  <span>{model.sleeps} dormen</span>
                </div>
                <p>{model.features.slice(0, 4).join(" · ")}</p>
                <strong>{model.pricePerDay} € <small>/ dia</small></strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel reviews-panel">
          <h2>El que diuen els nostres clients</h2>
          {comments.length ? (
            comments.map((comment) => (
              <article className="review" key={comment.id}>
                <div className="avatar">{comment.user?.name?.charAt(0) || "V"}</div>
                <div>
                  <strong>{comment.user?.name || "Viatger"}</strong>
                  <Stars rating={comment.rating} />
                  <p>{comment.content}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="muted">Encara no hi ha opinions persistides. Executa el seed per carregar-ne.</p>
          )}
        </div>

        <div className="panel booking-panel" id="contacte">
          <h2>Reserva la teva furgoneta</h2>
          <InfoRequestForm />
        </div>
      </section>

      <section className="security-strip">
        <h2>Confianca, seguretat i llibertat per al teu viatge</h2>
        <div>
          <span><ShieldCheck size={22} /> Pagament 100% segur</span>
          <span><CalendarCheck size={22} /> Cancel-lacio flexible</span>
          <span><MapPin size={22} /> Suport local 24/7</span>
        </div>
      </section>
    </main>
  );
}
