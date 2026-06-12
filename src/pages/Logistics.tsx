import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Fleet from "../sections/Fleet";
import Technology from "../sections/Technology";
import Stats from "../sections/Stats";
import Services from "../sections/Services";
import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";
import Footer from "../components/Footer";
import PointerBackdrop from "../components/PointerBackdrop";
import SmoothScroll from "../components/SmoothScroll";

/** Logistics template — full enterprise freight site. */
export default function Logistics() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-cream-50">
      <SmoothScroll />
      <PointerBackdrop />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Fleet />
          <Technology />
          <Stats />
          <Services />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
