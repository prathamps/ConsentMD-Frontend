"use client"

import Link from "next/link"
import {
	LucideIcon,
	Bell,
	Home,
	Users,
	HeartPulse,
	FileText,
	FileKey,
	User,
	Stethoscope,
	Bot,
	Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hooks"

interface NavLink {
	href: string
	icon: LucideIcon
	text: string
}

export default function Sidebar() {
	const { user } = useAppSelector((state) => state.auth)

	const patientLinks: NavLink[] = [
		{ href: "/dashboard", icon: Home, text: "Dashboard" },
		{ href: "/dashboard/doctors", icon: Stethoscope, text: "Find a Doctor" },
		{ href: "/dashboard/records", icon: FileText, text: "My Records" },
		{
			href: "/dashboard/consultations",
			icon: Users,
			text: "My Consultations",
		},
		{ href: "/dashboard/consent", icon: FileKey, text: "My Consents" },
	]

	const doctorLinks: NavLink[] = [
		{ href: "/dashboard", icon: Home, text: "Dashboard" },
		{
			href: "/dashboard/requests",
			icon: Bell,
			text: "Consultation Requests",
		},
		{ href: "/dashboard/patients", icon: Users, text: "My Patients" },
		{
			href: "/dashboard/accessible-records",
			icon: FileText,
			text: "Accessible Records",
		},
		{ href: "/dashboard/profile", icon: User, text: "Profile" },
	]

	const adminLinks: NavLink[] = [
		{ href: "/dashboard", icon: Home, text: "Dashboard" },
		{ href: "/dashboard/doctors", icon: Stethoscope, text: "Doctors" },
		{ href: "/dashboard/patients", icon: Users, text: "Patients" },
		{ href: "/dashboard/health", icon: Bot, text: "System Health" },
		{ href: "/dashboard/settings", icon: Settings, text: "Settings" },
	]

	const getNavLinks = () => {
		if (!user) {
			return []
		}
		switch (user.role) {
			case "patient":
				return patientLinks
			case "doctor":
				return doctorLinks
			case "admin":
				return adminLinks
			default:
				return []
		}
	}

	const navLinks = getNavLinks()

	return (
		<div className="flex h-full max-h-screen flex-col gap-2">
			<div className="flex h-14 items-center border-b px-3 sm:px-4 lg:h-[60px] lg:px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
					<span className="text-sm sm:text-base">Telemedicine</span>
				</Link>
				<Button
					variant="outline"
					size="icon"
					className="ml-auto h-7 w-7 sm:h-8 sm:w-8"
				>
					<Bell className="h-3 w-3 sm:h-4 sm:w-4" />
					<span className="sr-only">Toggle notifications</span>
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto">
				<nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
					{navLinks.map((link) => (
						<Link
							key={link.text}
							href={link.href}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50 active:bg-muted"
						>
							<link.icon className="h-4 w-4 flex-shrink-0" />
							<span className="truncate">{link.text}</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	)
}
