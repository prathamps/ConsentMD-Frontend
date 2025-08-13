"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavigationItem {
	label: string
	href: string
	isExternal?: boolean
}

interface LandingNavigationProps {
	className?: string
}

const navigationItems: NavigationItem[] = [
	{ label: "Features", href: "#features" },
	{ label: "About", href: "#footer" },
	{ label: "Dashboard", href: "/dashboard", isExternal: true },
]

export function LandingNavigation({ className }: LandingNavigationProps) {
	const [isOpen, setIsOpen] = React.useState(false)

	const handleSmoothScroll = (href: string, isExternal?: boolean) => {
		if (isExternal) {
			window.location.href = href
		} else if (href.startsWith("#")) {
			const element = document.querySelector(href)
			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "start",
				})
			}
		}
		setIsOpen(false)
	}

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				className
			)}
		>
			<div className="container flex h-16 items-center justify-between">
				{/* Logo/Brand */}
				<Link href="/" className="flex items-center space-x-2">
					<div className="h-8 w-10 rounded-lg bg-primary flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">
							CMD
						</span>
					</div>
					<span className="font-bold text-lg">ConsentMD</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-6">
					{navigationItems.map((item) => (
						<button
							key={item.label}
							onClick={() => handleSmoothScroll(item.href, item.isExternal)}
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							{item.label}
						</button>
					))}
				</nav>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center space-x-4">
					<ModeToggle />
					<Button variant="ghost" asChild>
						<Link href="/login">Login</Link>
					</Button>
					<Button asChild>
						<Link href="/register">Get Started</Link>
					</Button>
				</div>

				{/* Mobile Navigation */}
				<div className="flex md:hidden items-center space-x-2">
					<ModeToggle />
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col space-y-4 mt-6">
								{navigationItems.map((item) => (
									<button
										key={item.label}
										onClick={() =>
											handleSmoothScroll(item.href, item.isExternal)
										}
										className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
									>
										{item.label}
									</button>
								))}
								<div className="border-t pt-4 space-y-2">
									<Button
										variant="ghost"
										className="w-full justify-start"
										asChild
									>
										<Link href="/login" onClick={() => setIsOpen(false)}>
											Login
										</Link>
									</Button>
									<Button className="w-full" asChild>
										<Link href="/register" onClick={() => setIsOpen(false)}>
											Get Started
										</Link>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
