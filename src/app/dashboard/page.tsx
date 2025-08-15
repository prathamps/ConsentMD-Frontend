"use client"

import { useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Users, FileKey, Stethoscope, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
	const { user } = useAppSelector((state) => state.auth)
	const { stats, isLoading, fetchStats } = useDashboardStats()

	useEffect(() => {
		fetchStats()

		// Refetch stats when the window gains focus to keep them up-to-date
		const handleFocus = () => fetchStats()
		window.addEventListener("focus", handleFocus)

		return () => {
			window.removeEventListener("focus", handleFocus)
		}
	}, [fetchStats])

	const renderPatientDashboard = () => (
		<>
			<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Records</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">{stats.records}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Consents
						</CardTitle>
						<FileKey className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">
							{stats.consents}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Consultations
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">
							{stats.consultations}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-3 sm:space-y-4">
				<h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<Button asChild className="w-full sm:w-auto">
						<Link href="/dashboard/records">
							<FileText className="mr-2 h-4 w-4" />
							<span className="hidden sm:inline">Manage My Records</span>
							<span className="sm:hidden">My Records</span>
						</Link>
					</Button>
					<Button asChild variant="secondary" className="w-full sm:w-auto">
						<Link href="/dashboard/doctors">
							<Stethoscope className="mr-2 h-4 w-4" />
							<span className="hidden sm:inline">Find a Doctor</span>
							<span className="sm:hidden">Find Doctor</span>
						</Link>
					</Button>
				</div>
			</div>
		</>
	)

	const renderDoctorDashboard = () => (
		<>
			<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Requests
						</CardTitle>
						<Bell className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">
							{stats.requests}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Assigned Patients
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">
							{stats.patients}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Accessible Records
						</CardTitle>
						<FileKey className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl font-bold">
							{stats.accessibleRecords}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-3 sm:space-y-4">
				<h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<Button asChild className="w-full sm:w-auto">
						<Link href="/dashboard/requests">
							<Bell className="mr-2 h-4 w-4" />
							<span className="hidden sm:inline">View Requests</span>
							<span className="sm:hidden">Requests</span>
						</Link>
					</Button>
					<Button asChild variant="secondary" className="w-full sm:w-auto">
						<Link href="/dashboard/patients">
							<Users className="mr-2 h-4 w-4" />
							<span className="hidden sm:inline">Manage Patients</span>
							<span className="sm:hidden">Patients</span>
						</Link>
					</Button>
				</div>
			</div>
		</>
	)

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="text-xl sm:text-2xl font-bold truncate">
					Welcome, {user?.name || "User"}!
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Here&apos;s a summary of your activities.
				</p>
			</div>

			{isLoading && (
				<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<Skeleton className="h-5 w-2/3" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-1/4" />
							</CardContent>
						</Card>
					))}
				</div>
			)}
			{!isLoading && user?.role === "patient" && renderPatientDashboard()}
			{!isLoading && user?.role === "doctor" && renderDoctorDashboard()}
			{!isLoading && !user?.role && (
				<Card>
					<CardHeader>
						<CardTitle>Get Started</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							It looks like you&apos;re not logged in. Please log in to see your
							dashboard.
						</p>
						<Button asChild className="mt-4">
							<Link href="/login">Go to Login</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
