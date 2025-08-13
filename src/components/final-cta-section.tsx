"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CTAButton {
	text: string
	href: string
	variant?:
		| "default"
		| "secondary"
		| "outline"
		| "ghost"
		| "destructive"
		| "link"
}

interface FinalCTASectionProps {
	headline?: string
	description?: string
	primaryCTA?: CTAButton
	secondaryCTA?: CTAButton
	className?: string
}

export function FinalCTASection({
	headline = "Ready to Streamline Your Consent Process?",
	description = "Streamline your healthcare consent management process with our secure, efficient digital platform. Start your journey today.",
	primaryCTA = {
		text: "Get Started Now",
		href: "/register",
		variant: "default",
	},
	secondaryCTA = {
		text: "Sign In",
		href: "/login",
		variant: "outline",
	},
	className,
}: FinalCTASectionProps) {
	return (
		<section
			className={cn(
				"relative py-20 px-4 overflow-hidden",
				"bg-gradient-to-br from-primary/5 via-background to-primary/10",
				className
			)}
		>
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
			</div>

			<div className="container mx-auto max-w-4xl text-center">
				{/* Icon */}
				<div className="flex justify-center mb-6">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
						<Sparkles className="h-8 w-8 text-primary" />
					</div>
				</div>

				{/* Headline */}
				<h2
					className={cn(
						"text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6",
						"bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
					)}
				>
					{headline}
				</h2>

				{/* Description */}
				<p
					className={cn(
						"mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10",
						"leading-relaxed"
					)}
				>
					{description}
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-8">
					<Button
						size="lg"
						variant={primaryCTA.variant}
						className={cn(
							"text-base px-8 py-6 h-auto font-semibold",
							"group transition-all duration-200 hover:scale-105"
						)}
						asChild
					>
						<Link href={primaryCTA.href} className="flex items-center gap-2">
							{primaryCTA.text}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
					<Button
						size="lg"
						variant={secondaryCTA.variant}
						className="text-base px-8 py-6 h-auto font-semibold"
						asChild
					>
						<Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}
