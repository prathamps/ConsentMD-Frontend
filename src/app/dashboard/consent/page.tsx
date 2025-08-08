"use client"

import { useState, useEffect, useMemo } from "react"
import api from "@/services/api"
import { AxiosError } from "axios"
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
import { Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

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

interface Doctor {
	id: string
	name: string
	blockchainId: string
}

interface RecordData {
	docType: string
	recordId: string
	details: string
}

interface RecordItem {
	key: string
	record: RecordData
}

interface DetailsObject {
	symptoms?: string
	diagnosis?: string
}

export default function ConsentPage() {
	const [consents, setConsents] = useState<ConsentItem[]>([])
	const [doctors, setDoctors] = useState<Doctor[]>([])
	const [medicalRecords, setMedicalRecords] = useState<RecordItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const doctorMap = useMemo(() => {
		const map = new Map<string, string>()
		doctors.forEach((doc) => {
			map.set(doc.id, doc.name)
			if (doc.blockchainId) {
				map.set(doc.blockchainId, doc.name)
			}
		})
		return map
	}, [doctors])

	const recordMap = useMemo(() => {
		const map = new Map<string, RecordData>()
		medicalRecords.forEach((item) => {
			map.set(item.record.recordId, item.record)
		})
		return map
	}, [medicalRecords])

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const [consentsRes, doctorsRes, recordsRes] = await Promise.all([
					api.get("/records/consents/mine"),
					api.get("/users/doctors", { params: { page: 0, size: 100 } }),
					api.get("/records/mine"),
				])

				const rawConsents: ConsentItem[] = consentsRes.data.payload || []

				// Step 1: Filter for only active consents
				const activeConsents = rawConsents.filter(
					(c) => c.record.status === "granted"
				)

				// Step 2: Filter for unique, most recent consents from the active list
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

				setConsents(Array.from(uniqueConsentsMap.values()))
				setDoctors(doctorsRes.data.docs || [])
				setMedicalRecords(recordsRes.data.payload || [])
				setError(null)
			} catch (err) {
				const error = err as AxiosError
				setError(
					(error.response?.data as { message: string })?.message ||
						"Failed to fetch page data."
				)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleRevokeConsent = async (consentId: string) => {
		const originalConsents = consents
		setConsents((prev) => prev.filter((c) => c.record.consentId !== consentId))

		try {
			await api.delete(`/records/consents/${consentId}`)
			toast.success("Consent revoked successfully!")
		} catch (err) {
			setConsents(originalConsents)
			const error = err as AxiosError
			toast.error(
				(error.response?.data as { message: string })?.message ||
					"Failed to revoke consent."
			)
		}
	}

	const getDetailsSnippet = (details: string | undefined): string => {
		if (!details) return "N/A"
		try {
			const parsedDetails: DetailsObject =
				typeof details === "string" ? JSON.parse(details) : details
			const summary =
				parsedDetails.symptoms ||
				parsedDetails.diagnosis ||
				"No summary available."
			return summary.length > 50 ? `${summary.substring(0, 47)}...` : summary
		} catch {
			const strDetails = String(details)
			return strDetails.length > 50
				? `${strDetails.substring(0, 47)}...`
				: strDetails
		}
	}

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>My Active Consents</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Document Type</TableHead>
								<TableHead>Details</TableHead>
								<TableHead>Doctor Name</TableHead>
								<TableHead>Date Granted</TableHead>
								<TableHead className="text-right">Revoke</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								[...Array(3)].map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<Skeleton className="h-4 w-full" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-full" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-2/3" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-1/2" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-8 w-8 rounded-full" />
										</TableCell>
									</TableRow>
								))
							) : error ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center text-red-500">
										{error}
									</TableCell>
								</TableRow>
							) : consents.length > 0 ? (
								consents.map((item) => {
									const medicalRecord = recordMap.get(item.record.recordId)
									return (
										<TableRow key={item.key}>
											<TableCell>{medicalRecord?.docType || "..."}</TableCell>
											<TableCell>
												{getDetailsSnippet(medicalRecord?.details)}
											</TableCell>
											<TableCell>
												{doctorMap.get(item.record.doctorId) ||
													"Unknown Doctor"}
											</TableCell>
											<TableCell>
												{new Date(item.record.grantedAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														handleRevokeConsent(item.record.consentId)
													}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										You have not granted any consents.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
