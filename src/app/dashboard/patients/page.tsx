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
		<>
			<Card>
				<CardHeader>
					<CardTitle>My Patients</CardTitle>
				</CardHeader>
				<CardContent>
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
										<Skeleton className="h-4 w-[250px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[250px]" />
									</TableCell>
									<TableCell className="text-right">
										<Skeleton className="h-4 w-[180px]" />
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
										<TableCell>{patient.name}</TableCell>
										<TableCell>{patient.email}</TableCell>
										<TableCell className="text-right">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCreateRecordClick(patient.id)}
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
		</>
	)
}
