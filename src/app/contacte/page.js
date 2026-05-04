import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InfoRequestForm } from "@/components/InfoRequestForm";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="page-hero page-hero--contact">
        <p className="eyebrow"><Mail size={16} /> Contacte</p>
        <h1>Planifiquem la teva propera escapada.</h1>
        <p>
          Envia una sol-licitud i et respondrem amb disponibilitat, recomanacio de model i pressupost orientatiu.
        </p>
      </section>

      <section className="section-shell contact-grid">
        <div className="panel contact-info">
          <h2>VanLife Rentals</h2>
          <p>Assessorament directe per trobar la camper que encaixa amb dies, ruta i pressupost.</p>
          <div className="contact-methods">
            <span><Phone size={18} /> +34 600 000 000</span>
            <span><Mail size={18} /> reserves@vanlife.test</span>
            <span><MapPin size={18} /> Barcelona, Catalunya</span>
            <span><Clock size={18} /> Dilluns a dissabte, 9:00 - 19:00</span>
          </div>
        </div>
        <div className="panel">
          {/* Formulario publico persistido en InfoRequest. */}
          <InfoRequestForm />
        </div>
      </section>
    </main>
  );
}
