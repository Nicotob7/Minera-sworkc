import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { QuienesSomos } from "../components/sections/QuienesSomos";
import { Servicios } from "../components/sections/Servicios";
import { DashboardInteractivo } from "../components/sections/DashboardInteractivo";
import { FranjaAzul } from "../components/sections/FranjaAzul";
import { Contacto } from "../components/sections/Contacto";
import { FAQ } from "../components/sections/FAQ";
import { Footer } from "../components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido" className="flex-1">
        <Hero />
        <QuienesSomos />
        <Servicios />
        <FranjaAzul />
        <DashboardInteractivo />
        
        <Contacto />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
