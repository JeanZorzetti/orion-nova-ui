import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSolution from "@/components/landing/ProblemSolution";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ProductShowcase from "@/components/landing/ProductShowcase";
import AIPreview from "@/components/landing/AIPreview";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
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
  );
}
