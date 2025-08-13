"use client"

import * as React from "react"
import { Shield, Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureItem {
	title: string
	description: string
	icon: React.ComponentType<{ className?: string }>
}

interface FeaturesSectionProps {
	className?: string
}

const features: FeatureItem[] = [
	{
		title: "Secure & HIPAA Compliant",
		description:
			"End-to-end encryption ensures your health data stays private and secure.",
		icon: Shield,
	},
	{
		title: "24/7 Availability",
		description:
			"Access healthcare professionals anytime, anywhere with flexible scheduling.",
		icon: Clock,
	},
	{
		title: "Easy Connection",
		description:
			"Connect patients and providers seamlessly with our intuitive platform.",
		icon: Users,
	},
]

export function FeaturesSection({ className }: FeaturesSectionProps) {
	return (
		<section id="features" className={cn("py-20 px-4", className)}>
			<div className="container mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
						Why Choose Our Platform
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Experience the future of healthcare with our secure, efficient, and
						user-friendly telemedicine platform.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => {
						const IconComponent = feature.icon
						return (
							<Card
								key={index}
								className="text-center p-6 border-0 bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
							>
								<CardContent className="p-0 space-y-4">
									<div className="flex justify-center">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
											<IconComponent className="h-6 w-6 text-primary" />
										</div>
									</div>
									<h3 className="text-xl font-semibold">{feature.title}</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}
