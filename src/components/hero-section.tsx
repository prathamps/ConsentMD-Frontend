"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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

interface HeroSectionProps {
	headline?: string
	subheadline?: string
	primaryCTA?: CTAButton
	secondaryCTA?: CTAButton
	className?: string
}

export function HeroSection({
	headline = "Connect Healthcare Professionals and Patients Seamlessly",
	subheadline = "Experience secure, efficient telemedicine consultations with our comprehensive platform designed for modern healthcare delivery.",
	primaryCTA = {
		text: "Get Started",
		href: "/register",
		variant: "default",
	},
	secondaryCTA = {
		text: "Login",
		href: "/login",
		variant: "outline",
	},
	className,
}: HeroSectionProps) {
	return (
		<section
			className={cn(
				"relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 text-center",
				"bg-gradient-to-b from-background to-muted/20",
				className
			)}
		>
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
			</div>

			<div className="container mx-auto max-w-4xl space-y-8">
				{/* Main Headline */}
				<h1
					className={cn(
						"text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
						"bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
						"leading-tight"
					)}
				>
					{headline}
				</h1>

				{/* Subheadline */}
				<p
					className={cn(
						"mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl",
						"leading-relaxed"
					)}
				>
					{subheadline}
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
					<Button
						size="lg"
						variant={primaryCTA.variant}
						className="text-base px-8 py-6 h-auto font-semibold"
						asChild
					>
						<Link href={primaryCTA.href}>{primaryCTA.text}</Link>
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

				{/* Trust indicators */}
				<div className="pt-8 space-y-4">
					<p className="text-sm text-muted-foreground font-medium">
						Trusted by healthcare professionals worldwide
					</p>
					<div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
						<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							HIPAA Compliant
						</div>
						<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<div className="h-2 w-2 rounded-full bg-blue-500" />
							End-to-End Encrypted
						</div>
						<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<div className="h-2 w-2 rounded-full bg-purple-500" />
							24/7 Support
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
