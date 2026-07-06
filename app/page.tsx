import { HeroSection } from "@/components/sections/hero-section";
import { CategoryNav } from "@/components/sections/category-nav";
import { CategoryCardsSection } from "@/components/sections/category-cards-section";
import { GiftingSection } from "@/components/sections/gifting-section";
import { RetailSection } from "@/components/sections/retail-section";
import { AboutSection } from "@/components/sections/about-section";
import { VideoGallerySection } from "@/components/sections/video-gallery-section";
import { WorkshopsSection } from "@/components/sections/workshops-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";
import { CorporateSection } from "@/components/sections/corporate-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GoogleReviewsSection } from "@/components/sections/google-reviews-section";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { StoreSection } from "@/components/sections/store-section";
import { DeliverySection } from "@/components/sections/delivery-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryNav />
      <CategoryCardsSection />
      <GiftingSection />
      {/* <RetailSection /> */}
      <AboutSection />
      {/*<VideoGallerySection />
      <WorkshopsSection />
      <AnnouncementsSection /> */}
      <CorporateSection />
      <GallerySection />
      {/* <StoreSection />
      <DeliverySection /> */}
      <GoogleReviewsSection />
      <InstagramFeed />
      <ContactSection />
    </>
  );
}
