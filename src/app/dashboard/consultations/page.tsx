"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import api from "@/services/api"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

type Consultation = {
	id: string
	doctor: {
		name: string
		specialization?: string
	}
	status: "pending" | "approved" | "rejected"
}

export default function MyConsultationsPage() {
	const [consultations, setConsultations] = useState<Consultation[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchConsultations = async () => {
			setIsLoading(true)
			try {
				const response = await api.get("/consultations/mine")
				setConsultations(response.data.payload || [])
				setError(null)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					setError(err.response.data.message || "An unexpected error occurred.")
				} else {
					setError("Failed to fetch consultations.")
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchConsultations()
	}, [])

	const getStatusVariant = (status: Consultation["status"]) => {
		switch (status) {
			case "approved":
				return "default"
			case "pending":
				return "secondary"
			case "rejected":
				return "destructive"
			default:
				return "outline"
		}
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile Card View */}
			<div className="block sm:hidden space-y-4">
				<h1 className="text-xl font-bold">My Consultations</h1>
				{isLoading ? (
					Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-6 w-20" />
								</div>
							</CardContent>
						</Card>
					))
				) : error ? (
					<Card>
						<CardContent className="p-4 text-center text-red-500">
							{error}
						</CardContent>
					</Card>
				) : consultations.length > 0 ? (
					consultations.map((c) => (
						<Card key={c.id}>
							<CardContent className="p-4">
								<div className="space-y-2">
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium">{c.doctor.name}</p>
											<p className="text-sm text-muted-foreground">
												{c.doctor?.specialization || "N/A"}
											</p>
										</div>
										<Badge variant={getStatusVariant(c.status)}>
											{c.status}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-4 text-center">
							No consultations found.
						</CardContent>
					</Card>
				)}
			</div>

			{/* Desktop Table View */}
			<Card className="hidden sm:block">
				<CardHeader>
					<CardTitle>My Consultations</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Doctor</TableHead>
									<TableHead>Specialization</TableHead>
									<TableHead className="text-right">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell>
											<Skeleton className="h-4 w-[200px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[150px]" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-4 w-[80px]" />
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center text-red-500">
											{error}
										</TableCell>
									</TableRow>
								) : consultations.length > 0 ? (
									consultations.map((c) => (
										<TableRow key={c.id}>
											<TableCell className="font-medium">
												{c.doctor.name}
											</TableCell>
											<TableCell>{c.doctor?.specialization || "N/A"}</TableCell>
											<TableCell className="text-right">
												<Badge variant={getStatusVariant(c.status)}>
													{c.status}
												</Badge>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={3} className="text-center">
											No consultations found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
