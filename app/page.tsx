import { HeroSection } from "@/components/sections/hero-section";
import { CategoryNav } from "@/components/sections/category-nav";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { WeekendSpecials } from "@/components/sections/weekend-specials";
import { BundlesSection } from "@/components/sections/bundles-section";
import { GiftingSection } from "@/components/sections/gifting-section";
import { AboutSection } from "@/components/sections/about-section";
import { WorkshopsSection } from "@/components/sections/workshops-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { StoreSection } from "@/components/sections/store-section";
import { DeliverySection } from "@/components/sections/delivery-section";
import { CorporateSection } from "@/components/sections/corporate-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryNav />
      <FeaturedProducts />
      <WeekendSpecials />
      <BundlesSection />
      <GiftingSection />
      <AboutSection />
      <WorkshopsSection />
      <AnnouncementsSection />
      <TestimonialsSection />
      <GallerySection />
      <StoreSection />
      <DeliverySection />
      <CorporateSection />
      <ContactSection />
    </>
  );
}
