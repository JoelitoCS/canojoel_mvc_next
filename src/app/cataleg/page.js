import { Filter, SlidersHorizontal } from "lucide-react";
import { ModelCard } from "@/components/ModelCard";
import { getAllModels } from "@/lib/data";

// El catalogo debe consultar los modelos actuales de la base de datos.
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  // Recupera todos los modelos disponibles para mostrarlos como catalogo serio.
  const models = await getAllModels();

  return (
    <main className="page-shell">
      <section className="page-hero page-hero--compact">
        <p className="eyebrow"><Filter size={16} /> Cataleg camper</p>
        <h1>Tria la furgoneta adequada per la teva ruta.</h1>
        <p>
          Models persistits en base de dades, amb caracteristiques, places i preu orientatiu per dia.
        </p>
      </section>

      <section className="section-shell catalog-toolbar">
        {/* Barra visual preparada para futuros filtros reales. */}
        <span><SlidersHorizontal size={18} /> {models.length} models disponibles</span>
        <span>Ordenat per destacats i preu</span>
      </section>

      <section className="section-shell model-cards model-cards--catalog">
        {/* Cada modelo mantiene enlace a su ficha con comentarios. */}
        {models.map((model) => (
          <ModelCard key={model.slug} model={model} />
        ))}
      </section>
    </main>
  );
}
