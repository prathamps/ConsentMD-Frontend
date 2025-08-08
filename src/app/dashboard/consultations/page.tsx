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
		<Card>
			<CardHeader>
				<CardTitle>My Consultations</CardTitle>
			</CardHeader>
			<CardContent>
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
									<Skeleton className="h-4 w-[250px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[250px]" />
								</TableCell>
								<TableCell className="text-right">
									<Skeleton className="h-4 w-[100px]" />
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
									<TableCell>{c.doctor.name}</TableCell>
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
			</CardContent>
		</Card>
	)
}
