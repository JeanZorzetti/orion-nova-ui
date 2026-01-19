import { Metadata } from "next";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSolution from "@/components/landing/ProblemSolution";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ProductShowcase from "@/components/landing/ProductShowcase";
import AIPreview from "@/components/landing/AIPreview";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd, softwareSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata.home;

export default function Home() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <main>
          <HeroSection />
          <SocialProof />
          <ProblemSolution />
          <FeaturesGrid />
          <ProductShowcase />
          <AIPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
