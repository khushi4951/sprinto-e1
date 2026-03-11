import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Topics from "@/components/landing/Topics";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#060810] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Topics />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
