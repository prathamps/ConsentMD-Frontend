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
		title: "Secure Data",
		description: "Your health information is encrypted and stored securely.",
		icon: Shield,
	},
	{
		title: "Quick Access",
		description:
			"Find and manage patient records, appointments, and forms easily.",
		icon: Clock,
	},
	{
		title: "Simple Interface",
		description: "Clean, intuitive design that's easy for everyone to use.",
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
						Key Features
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need to manage healthcare records and consultations.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-3 gap-6">
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
