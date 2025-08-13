"use client"

import * as React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
	className?: string
}

export function Footer({ className }: FooterProps) {
	return (
		<footer id="footer" className={cn("bg-muted/50 border-t", className)}>
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-3 gap-8">
					{/* Brand */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="h-8 w-10 rounded-lg bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									CMD
								</span>
							</div>
							<span className="text-xl font-bold">ConsentMD</span>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Streamlining healthcare consent management with secure, efficient
							digital solutions for medical professionals and patients.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="font-semibold">Quick Links</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="#features"
									className="hover:text-foreground transition-colors"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="/login"
									className="hover:text-foreground transition-colors"
								>
									Login
								</Link>
							</li>
							<li>
								<Link
									href="/register"
									className="hover:text-foreground transition-colors"
								>
									Get Started
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard"
									className="hover:text-foreground transition-colors"
								>
									Dashboard
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className="space-y-4">
						<h3 className="font-semibold">Legal & Support</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/"
									className="hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-foreground transition-colors"
								>
									HIPAA Compliance
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-foreground transition-colors"
								>
									Contact Support
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						© 2025 ConsentMD. All rights reserved.
					</p>
					<div className="flex items-center gap-6 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span>All systems operational</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
