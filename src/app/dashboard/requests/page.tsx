// /dashboard/requests/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import CreateRecordModal from "../patients/_components/CreateRecordModal"

type ConsultationRequest = {
	id: string
	patient: {
		_id: string
		name: string
		blockchainId: string
	}
	status: "pending" | "approved" | "rejected"
}

export default function RequestsPage() {
	const [requests, setRequests] = useState<ConsultationRequest[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
		null
	)

	const fetchRequests = async () => {
		setIsLoading(true)
		try {
			const response = await api.get("/consultations/requests")
			const allRequests: ConsultationRequest[] = response.data.payload || []

			// De-duplicate requests based on their ID to prevent key errors
			const uniqueRequests = Array.from(
				new Map(allRequests.map((req) => [req.id, req])).values()
			)

			setRequests(uniqueRequests)
			setError(null)
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data.message || "An unexpected error occurred.")
			} else {
				setError("Failed to fetch consultation requests.")
			}
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchRequests()
	}, [])

	const handleUpdateRequest = async (
		id: string,
		status: "approved" | "rejected"
	) => {
		try {
			await api.patch(`/consultations/${id}`, { status })
			fetchRequests() // Refresh list
		} catch (err) {
			console.error(`Failed to ${status} consultation`, err)
			setError("Failed to update consultation request.")
		}
	}

	const handleCreateRecord = (patientId: string) => {
		setSelectedPatientId(patientId)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedPatientId(null)
	}

	const handleRecordCreated = () => {
		// Optionally, you might want to refresh or update the UI state
		console.log("Record created, consider updating the UI if needed.")
		fetchRequests()
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile Card View */}
			<div className="block sm:hidden space-y-4">
				<h1 className="text-xl font-bold">Consultation Requests</h1>
				{isLoading ? (
					Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/3" />
									<div className="flex gap-2">
										<Skeleton className="h-10 flex-1" />
										<Skeleton className="h-10 flex-1" />
									</div>
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
				) : requests.length > 0 ? (
					requests.map((req) => (
						<Card key={req.id}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<p className="font-medium">{req.patient?.name || "N/A"}</p>
										<p className="text-sm text-muted-foreground capitalize">
											{req.status}
										</p>
									</div>
									<div className="flex gap-2">
										{req.status === "pending" && (
											<>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleUpdateRequest(req.id, "approved")
													}
													className="flex-1"
												>
													Approve
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() =>
														handleUpdateRequest(req.id, "rejected")
													}
													className="flex-1"
												>
													Reject
												</Button>
											</>
										)}
										{req.status === "approved" && (
											<Button
												variant="default"
												size="sm"
												onClick={() =>
													handleCreateRecord(req.patient.blockchainId)
												}
												className="w-full"
											>
												Create Record
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-4 text-center">
							No consultation requests found.
						</CardContent>
					</Card>
				)}
			</div>

			{/* Desktop Table View */}
			<Card className="hidden sm:block">
				<CardHeader>
					<CardTitle>Consultation Requests</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Patient Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow key="loading-row">
										<TableCell>
											<Skeleton className="h-4 w-[200px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[80px]" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-4 w-[150px]" />
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow key="error-row">
										<TableCell colSpan={3} className="text-center text-red-500">
											{error}
										</TableCell>
									</TableRow>
								) : requests.length > 0 ? (
									requests.map((req) => (
										<TableRow key={req.id}>
											<TableCell className="font-medium">
												{req.patient?.name || "N/A"}
											</TableCell>
											<TableCell className="capitalize">{req.status}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													{req.status === "pending" && (
														<>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleUpdateRequest(req.id, "approved")
																}
															>
																Approve
															</Button>
															<Button
																variant="destructive"
																size="sm"
																onClick={() =>
																	handleUpdateRequest(req.id, "rejected")
																}
															>
																Reject
															</Button>
														</>
													)}
													{req.status === "approved" && (
														<Button
															variant="default"
															size="sm"
															onClick={() =>
																handleCreateRecord(req.patient.blockchainId)
															}
														>
															Create Record
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow key="no-requests-row">
										<TableCell colSpan={3} className="text-center">
											No consultation requests found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
			{isModalOpen && selectedPatientId && (
				<CreateRecordModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					patientId={selectedPatientId}
					onRecordCreated={handleRecordCreated}
				/>
			)}
		</div>
	)
}
