import Link from "next/link";
import { BedDouble, UsersRound } from "lucide-react";

export function ModelCard({ model, featured = false }) {
  // Tarjeta reutilizable para landing y catalogo.
  return (
    <Link className={featured ? "model-card model-card--featured" : "model-card"} href={`/models/${model.slug}`}>
      <span className="model-card__image">
        <img src={model.imageUrl} alt={model.name} />
      </span>
      <span className="model-card__body">
        <span className="model-card__brand">{model.brand}</span>
        <strong>{model.name}</strong>
        <span className="model-card__meta">
          <span><UsersRound size={16} /> {model.seats} places</span>
          <span><BedDouble size={16} /> {model.sleeps} dormen</span>
        </span>
        <span className="model-card__features">{model.features.slice(0, 4).join(" · ")}</span>
        <span className="model-card__price">{model.pricePerDay} € <small>/ dia</small></span>
      </span>
    </Link>
  );
}
