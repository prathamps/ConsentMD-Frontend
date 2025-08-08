"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import api from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Users, FileKey, Stethoscope, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ConsentRecord {
	consentId: string
	docType: string
	doctorId: string
	grantedAt: string
	patientId: string
	recordId: string
	revokedAt: string | null
	status: string
}

interface ConsentItem {
	key: string
	record: ConsentRecord
}

export default function DashboardPage() {
	const { user } = useAppSelector((state) => state.auth)
	const [stats, setStats] = useState({
		records: 0,
		consents: 0,
		consultations: 0,
		requests: 0,
		patients: 0,
		accessibleRecords: 0,
	})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchStats = async () => {
			if (!user?.role) {
				setIsLoading(false)
				return
			}

			setIsLoading(true)
			try {
				if (user.role === "patient") {
					const [recordsRes, consentsRes, consultationsRes] = await Promise.all(
						[
							api.get("/records/mine"),
							api.get("/records/consents/mine"),
							api.get("/consultations/mine"),
						]
					)

					const rawConsents: ConsentItem[] = consentsRes.data.payload || []
					const activeConsents = rawConsents.filter(
						(c) => c.record.status === "granted"
					)
					const uniqueConsentsMap = new Map<string, ConsentItem>()
					activeConsents.forEach((consent) => {
						const key = `${consent.record.recordId}-${consent.record.doctorId}`
						const existing = uniqueConsentsMap.get(key)
						if (
							!existing ||
							new Date(consent.record.grantedAt) >
								new Date(existing.record.grantedAt)
						) {
							uniqueConsentsMap.set(key, consent)
						}
					})

					setStats((prev) => ({
						...prev,
						records: recordsRes.data.payload?.length || 0,
						consents: uniqueConsentsMap.size,
						consultations:
							consultationsRes.data.payload?.filter(
								(c: { status: string }) => c.status === "pending"
							).length || 0,
					}))
				} else if (user.role === "doctor") {
					const [requestsRes, patientsRes, accessibleRecordsRes] =
						await Promise.all([
							api.get("/consultations/requests"),
							api.get("/users/assigned-patients"),
							api.get("/records/accessible"),
						])
					setStats((prev) => ({
						...prev,
						requests: requestsRes.data.payload?.length || 0,
						patients: patientsRes.data?.length || 0,
						accessibleRecords: accessibleRecordsRes.data.payload?.length || 0,
					}))
				}
			} catch (error) {
				console.error(`Failed to fetch ${user.role} dashboard stats:`, error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchStats()

		// Refetch stats when the window gains focus to keep them up-to-date
		const handleFocus = () => fetchStats()
		window.addEventListener("focus", handleFocus)

		return () => {
			window.removeEventListener("focus", handleFocus)
		}
	}, [user])

	const renderPatientDashboard = () => (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Records</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.records}</div>
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
						<div className="text-2xl font-bold">{stats.consents}</div>
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
						<div className="text-2xl font-bold">{stats.consultations}</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Quick Actions</h2>
				<div className="flex space-x-4">
					<Button asChild>
						<Link href="/dashboard/records">
							<FileText className="mr-2 h-4 w-4" /> Manage My Records
						</Link>
					</Button>
					<Button asChild variant="secondary">
						<Link href="/dashboard/doctors">
							<Stethoscope className="mr-2 h-4 w-4" /> Find a Doctor
						</Link>
					</Button>
				</div>
			</div>
		</>
	)

	const renderDoctorDashboard = () => (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Requests
						</CardTitle>
						<Bell className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.requests}</div>
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
						<div className="text-2xl font-bold">{stats.patients}</div>
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
						<div className="text-2xl font-bold">{stats.accessibleRecords}</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Quick Actions</h2>
				<div className="flex space-x-4">
					<Button asChild>
						<Link href="/dashboard/requests">
							<Bell className="mr-2 h-4 w-4" /> View Requests
						</Link>
					</Button>
					<Button asChild variant="secondary">
						<Link href="/dashboard/patients">
							<Users className="mr-2 h-4 w-4" /> Manage Patients
						</Link>
					</Button>
				</div>
			</div>
		</>
	)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Welcome, {user?.name || "User"}!</h1>
				<p className="text-muted-foreground">
					Here&apos;s a summary of your activities.
				</p>
			</div>

			{isLoading && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
