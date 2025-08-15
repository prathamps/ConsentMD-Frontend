// /dashboard/patients/page.tsx

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
import CreateRecordModal from "./_components/CreateRecordModal"

type Patient = {
	id: string
	name: string
	email: string
	blockchainId: string
}

export default function PatientsPage() {
	const [patients, setPatients] = useState<Patient[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
		null
	)

	const fetchPatients = async () => {
		setIsLoading(true)
		try {
			const response = await api.get("/users/assigned-patients")
			setPatients(response.data || [])
			setError(null)
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data.message || "An unexpected error occurred.")
			} else {
				setError("Failed to fetch assigned patients.")
			}
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchPatients()

		// Refetch patients when the window gains focus, to ensure data is fresh
		const handleFocus = () => fetchPatients()
		window.addEventListener("focus", handleFocus)

		return () => {
			window.removeEventListener("focus", handleFocus)
		}
	}, [])

	const handleCreateRecordClick = (patientId: string) => {
		setSelectedPatientId(patientId)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedPatientId(null)
	}

	const handleRecordCreated = () => {
		// Optionally, you can refetch patients or show a success message
		handleModalClose()
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile Card View */}
			<div className="block sm:hidden space-y-4">
				<h1 className="text-xl font-bold">My Patients</h1>
				{isLoading ? (
					Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-10 w-full" />
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
				) : patients.length > 0 ? (
					patients.map((patient) => (
						<Card key={patient.id}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<p className="font-medium">{patient.name}</p>
										<p className="text-sm text-muted-foreground truncate">
											{patient.email}
										</p>
									</div>
									<Button
										variant="outline"
										onClick={() =>
											handleCreateRecordClick(patient.blockchainId)
										}
										className="w-full"
									>
										Create Medical Record
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-4 text-center">
							You have no assigned patients.
						</CardContent>
					</Card>
				)}
			</div>

			{/* Desktop Table View */}
			<Card className="hidden sm:block">
				<CardHeader>
					<CardTitle>My Patients</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Patient Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell>
											<Skeleton className="h-4 w-[200px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[200px]" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-4 w-[150px]" />
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center text-red-500">
											{error}
										</TableCell>
									</TableRow>
								) : patients.length > 0 ? (
									patients.map((patient) => (
										<TableRow key={patient.id}>
											<TableCell className="font-medium">
												{patient.name}
											</TableCell>
											<TableCell>{patient.email}</TableCell>
											<TableCell className="text-right">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleCreateRecordClick(patient.blockchainId)
													}
												>
													Create Medical Record
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={3} className="text-center">
											You have no assigned patients.
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
