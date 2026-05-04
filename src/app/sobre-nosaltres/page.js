import { BadgeCheck, Compass, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="page-hero page-hero--about">
        <p className="eyebrow"><Compass size={16} /> Sobre nosaltres</p>
        <h1>Una empresa camper pensada per viatgers exigents.</h1>
        <p>
          Treballem amb flota revisada, processos clars i suport proper per convertir cada reserva en una experiencia fiable.
        </p>
      </section>

      <section className="section-shell about-grid">
        <article className="panel">
          <BadgeCheck size={28} />
          <h2>Qualitat operativa</h2>
          <p>Checklist abans de cada entrega, neteja professional i control de l&apos;equipament inclos.</p>
        </article>
        <article className="panel">
          <ShieldCheck size={28} />
          <h2>Seguretat</h2>
          <p>Vehicles verificats, asseguranca inclosa i assistencia durant tota la reserva.</p>
        </article>
        <article className="panel">
          <Compass size={28} />
          <h2>Criteri de ruta</h2>
          <p>Recomanem el model segons destinacio, dies, persones i tipus de viatge.</p>
        </article>
      </section>
    </main>
  );
}
