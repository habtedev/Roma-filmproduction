import HeroSection from "@/components/HeroSection";
import StatsBanner from "@/components/StatsBanner";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PhotosSection from "@/components/PhotosSection";
import VideosSection from "@/components/VideosSection";
import PackagesSection from "@/components/PackagesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";

export default async function Home() {
  // Modern Next.js Server-Side Data Fetching from Postgres API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  let serverPhotos = null;
  let serverTestimonials = null;
  try {
    const res = await fetch(`${API_URL}/api/content`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) {
      serverPhotos = json.data.photos;
      serverTestimonials = json.data.testimonials;
    }
  } catch (err) {
    console.error("Failed to fetch server-side photos:", err);
  }

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-x-hidden">

      {/* Intro Group - White/Default */}
      <HeroSection />
      <StatsBanner />
      <AboutSection />

      {/* Core Offerings - Muted Background */}
      <div className="bg-black/[0.015] dark:bg-white/[0.015]">
        <ServicesSection />
        <PhotosSection initialPhotos={serverPhotos} />
        <VideosSection />
      </div>

      {/* Details & Conversion - White/Default */}
      <PackagesSection />
      <TestimonialsSection initialTestimonials={serverTestimonials} />
      <FAQSection />

      {/* Climax - Muted Background */}
      <div className="bg-black/[0.015] dark:bg-white/[0.015]">
        <ContactSection />
      </div>

      {/* Final CTA — full-bleed cinematic */}
      <CTASection />

    </div>
  );
}
