"use client"

import * as React from "react"
import {
	Heart,
	Clock,
	Shield,
	Smartphone,
	Stethoscope,
	Users,
	Calendar,
	FileText,
	type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BenefitItem {
	title: string
	description: string
	icon: LucideIcon
}

interface BenefitsSectionProps {
	className?: string
}

const patientBenefits: BenefitItem[] = [
	{
		title: "Convenient Access",
		description:
			"Connect with healthcare professionals from the comfort of your home, eliminating travel time and waiting rooms.",
		icon: Smartphone,
	},
	{
		title: "24/7 Availability",
		description:
			"Access medical consultations whenever you need them, with flexible scheduling that fits your lifestyle.",
		icon: Clock,
	},
	{
		title: "Secure & Private",
		description:
			"Your health information is protected with end-to-end encryption and HIPAA-compliant security measures.",
		icon: Shield,
	},
	{
		title: "Personalized Care",
		description:
			"Receive individualized attention and treatment plans tailored to your specific health needs and concerns.",
		icon: Heart,
	},
]

const providerBenefits: BenefitItem[] = [
	{
		title: "Expand Your Practice",
		description:
			"Reach more patients beyond geographical limitations and grow your practice with telemedicine capabilities.",
		icon: Users,
	},
	{
		title: "Efficient Scheduling",
		description:
			"Streamline your appointment management with integrated scheduling tools and automated reminders.",
		icon: Calendar,
	},
	{
		title: "Professional Tools",
		description:
			"Access comprehensive diagnostic tools, patient records, and treatment planning features in one platform.",
		icon: Stethoscope,
	},
	{
		title: "Documentation Made Easy",
		description:
			"Simplify patient documentation with integrated note-taking, prescription management, and record keeping.",
		icon: FileText,
	},
]

function BenefitCard({
	benefit,
	className,
}: {
	benefit: BenefitItem
	className?: string
}) {
	const IconComponent = benefit.icon

	return (
		<Card
			className={cn(
				"h-full transition-all duration-200 hover:shadow-md",
				className
			)}
		>
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<IconComponent className="h-5 w-5 text-primary" />
					</div>
					<CardTitle className="text-lg">{benefit.title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground leading-relaxed">
					{benefit.description}
				</p>
			</CardContent>
		</Card>
	)
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
	return (
		<section id="benefits" className={cn("py-20 px-4 bg-muted/50", className)}>
			<div className="container mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
						Benefits for Everyone
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Our telemedicine platform is designed to serve both patients seeking
						convenient healthcare and providers looking to expand their practice
						reach.
					</p>
				</div>

				{/* Benefits Grid */}
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
					{/* Patient Benefits */}
					<div className="space-y-6">
						<div className="text-center lg:text-left">
							<h3 className="text-2xl font-semibold mb-2 text-primary">
								For Patients
							</h3>
							<p className="text-muted-foreground">
								Experience healthcare that fits your lifestyle
							</p>
						</div>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							{patientBenefits.map((benefit, index) => (
								<BenefitCard
									key={index}
									benefit={benefit}
									className="sm:col-span-1"
								/>
							))}
						</div>
					</div>

					{/* Provider Benefits */}
					<div className="space-y-6">
						<div className="text-center lg:text-left">
							<h3 className="text-2xl font-semibold mb-2 text-primary">
								For Healthcare Providers
							</h3>
							<p className="text-muted-foreground">
								Enhance your practice with modern telemedicine tools
							</p>
						</div>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							{providerBenefits.map((benefit, index) => (
								<BenefitCard
									key={index}
									benefit={benefit}
									className="sm:col-span-1"
								/>
							))}
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center mt-16">
					<p className="text-muted-foreground mb-6">
						Ready to experience the future of healthcare?
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/register"
							className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Get Started Today
						</a>
						<a
							href="/login"
							className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Login to Your Account
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}
