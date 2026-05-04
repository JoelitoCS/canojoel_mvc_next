import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

// Fuente principal de la aplicacion cargada con next/font.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Fuente monoespaciada disponible por si se necesita en estilos.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos base que Next.js inyecta en el head.
export const metadata = {
  title: "VanLife Rentals | Furgonetes camper",
  description: "Reserva furgonetes camper equipades per viure rutes sense complicacions.",
};

export default function RootLayout({ children }) {
  return (
    // lang="ca" indica que la interfaz esta escrita en catalan.
    <html lang="ca" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* Header compartido por todas las rutas. */}
        <Header />
        {/* children es la pagina concreta que renderiza App Router. */}
        {children}
      </body>
    </html>
  );
}
