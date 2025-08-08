import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-4xl font-bold mb-4">
				Welcome to Telemedicine Fabric
			</h1>
			<p className="text-lg text-muted-foreground mb-8">
				Your secure platform for patient and doctor interaction.
			</p>
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/login">Login</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/register">Register</Link>
				</Button>
			</div>
		</div>
	)
}
