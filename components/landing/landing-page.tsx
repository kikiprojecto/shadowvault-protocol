"use client"
import { HeroSection } from "./sections/hero-section"
import { ProblemSection } from "./sections/problem-section"
import { SolutionSection } from "./sections/solution-section"
import { FeaturesGrid } from "./sections/features-grid"
import { TechDeepDive } from "./sections/tech-deep-dive"
import { LiveDemoSection } from "./sections/live-demo-section"
import { CompetitiveAdvantage } from "./sections/competitive-advantage"
import { SecurityGuarantees } from "./sections/security-guarantees"
import { RoadmapSection } from "./sections/roadmap-section"
import { CTASection } from "./sections/cta-section"
import { Footer } from "./sections/footer"
import { Navigation } from "./navigation"

export function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <TechDeepDive />
      <LiveDemoSection />
      <CompetitiveAdvantage />
      <SecurityGuarantees />
      <RoadmapSection />
      <CTASection />
      <Footer />
    </div>
  )
}
