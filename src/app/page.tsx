import { LandingNavigation } from "@/components/landing-navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<LandingNavigation />
			<main>
				<HeroSection />
				<FeaturesSection />
				<FinalCTASection />
			</main>
			<Footer />
		</div>
	)
}
