"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from "react"
import { useAppSelector } from "@/store/hooks"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Share2 } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { PDFViewer } from "@/components/pdf-viewer"
import { Skeleton } from "@/components/ui/skeleton"

interface RecordData {
	docType: string
	recordId: string
	patientId: string
	details: string
	s3ObjectKey: string
	createdAt: string
}

interface RecordItem {
	key: string
	record: RecordData
}

interface Doctor {
	id: string
	name: string
	blockchainId: string
}

export default function MyRecordsPage() {
	const [records, setRecords] = useState<RecordItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { user } = useAppSelector((state) => state.auth)

	// State for the "Create Record" modal
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [newRecordDetails, setNewRecordDetails] = useState("")
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// State for the "View Details" and "Grant Consent" modals
	const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)
	const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)
	const [doctors, setDoctors] = useState<Doctor[]>([])
	const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")

	// State for the PDF Viewer modal
	const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false)
	const [pdfUrl, setPdfUrl] = useState<string | null>(null)

	// Function to parse the patient's email from the long ID string
	const getEmailFromPatientId = (patientId: string) => {
		const match = patientId.match(/CN=([^:]+)/)
		return match ? match[1] : "N/A"
	}

	// Function to open the S3 document by fetching a pre-signed URL
	const openDocument = async (recordId: string) => {
		try {
			const response = await api.get(`/records/${recordId}/file-url`)
			const { url } = response.data.payload
			if (url) {
				setPdfUrl(url)
				setIsPdfViewerOpen(true)
			} else {
				toast.error("Could not retrieve the document URL.")
			}
		} catch (err) {
			const error = err as AxiosError<{ message: string }>
			toast.error(
				error.response?.data?.message || "Failed to get document URL."
			)
		}
	}

	const fetchRecords = async () => {
		try {
			setIsLoading(true)
			const response = await api.get("/records/mine")
			setRecords(response.data.payload || [])
		} catch (err) {
			const error = err as AxiosError
			setError(
				(error.response?.data as { message: string })?.message ||
					"Failed to fetch records."
			)
		} finally {
			setIsLoading(false)
		}
	}

	const fetchDoctors = async () => {
		try {
			// Get the list of doctors the patient has consulted with
			const consultationsRes = await api.get("/consultations/mine")
			const consultedDoctorIds = new Set(
				consultationsRes.data.payload.map(
					(c: { doctor: { id: string } }) => c.doctor.id
				)
			)

			// Get the full list of doctors to find their blockchainId
			const allDoctorsRes = await api.get("/users/doctors", {
				params: { page: 1, size: 100 },
			})

			// Filter the full list to get the assigned doctors
			const assignedDoctors = allDoctorsRes.data.docs.filter((doc: Doctor) =>
				consultedDoctorIds.has(doc.id)
			)

			setDoctors(assignedDoctors || [])
		} catch (err) {
			console.error("Failed to fetch doctors for consent modal", err)
			toast.error("Could not load the list of assigned doctors.")
		}
	}

	useEffect(() => {
		if (user) {
			fetchRecords()
			fetchDoctors()
		}
	}, [user])

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedFile(event.target.files[0])
		}
	}

	const handleCreateSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!newRecordDetails || !selectedFile) {
			toast.error("Please fill in all fields and select a file.")
			return
		}

		setIsSubmitting(true)
		const formData = new FormData()
		formData.append("details", newRecordDetails)
		formData.append("file", selectedFile)

		try {
			await api.post("/records/self", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			toast.success("Record created successfully!")
			setNewRecordDetails("")
			setSelectedFile(null)
			setIsCreateModalOpen(false)
			fetchRecords()
		} catch (err) {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data?.message || "An unknown error occurred.")
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleGrantConsent = async () => {
		if (!selectedRecord || !selectedDoctorId) {
			toast.error("Please select a doctor.")
			return
		}
		const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId)
		if (!selectedDoctor) {
			toast.error("Could not find the selected doctor's details.")
			return
		}

		setIsSubmitting(true)
		try {
			await api.post("/records/consents", {
				recordId: selectedRecord.recordId,
				doctorId: selectedDoctor.blockchainId,
			})
			toast.success("Consent granted successfully!")
			setIsConsentModalOpen(false)
			setSelectedRecord(null)
			setSelectedDoctorId("")
		} catch (err) {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data?.message || "Failed to grant consent.")
		} finally {
			setIsSubmitting(false)
		}
	}

	const openViewModal = (record: RecordData) => {
		setSelectedRecord(record)
		setIsViewModalOpen(true)
	}

	const openConsentModal = (record: RecordData) => {
		setSelectedRecord(record)
		setIsConsentModalOpen(true)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold">My Medical Records</h1>
					<p className="text-muted-foreground">
						Here you can manage your uploaded medical records.
					</p>
				</div>
				<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
					<DialogTrigger asChild>
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" />
							Create New Record
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create a New Medical Record</DialogTitle>
							<DialogDescription>
								Fill in the details and upload your medical document.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleCreateSubmit} className="space-y-4">
							<Textarea
								placeholder="Enter record details (e.g., Annual Check-up Report)"
								value={newRecordDetails}
								onChange={(e) => setNewRecordDetails(e.target.value)}
								required
							/>
							<Input type="file" onChange={handleFileChange} required />
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsCreateModalOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Creating..." : "Create Record"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{error && <p className="text-red-500">{error}</p>}

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{isLoading
					? Array.from({ length: 3 }).map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="mt-2 h-4 w-1/2" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-10 w-full" />
								</CardContent>
								<CardFooter className="flex justify-between">
									<Skeleton className="h-10 w-24" />
									<Skeleton className="h-10 w-24" />
								</CardFooter>
							</Card>
					  ))
					: records.map(({ key, record }) => (
							<Card key={key}>
								<CardHeader>
									<CardTitle className="truncate">{record.docType}</CardTitle>
									<CardDescription>
										Created: {new Date(record.createdAt).toLocaleDateString()}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="line-clamp-2 text-sm text-muted-foreground">
										{record.details}
									</p>
								</CardContent>
								<CardFooter className="flex justify-between">
									<Button
										variant="outline"
										onClick={() => openViewModal(record)}
									>
										View Details
									</Button>
									<Button onClick={() => openConsentModal(record)}>
										<Share2 className="mr-2 h-4 w-4" />
										Grant Consent
									</Button>
								</CardFooter>
							</Card>
					  ))}
				{!isLoading && records.length === 0 && (
					<div className="col-span-full text-center">
						<p>No medical records found. Start by creating one!</p>
					</div>
				)}
			</div>

			{/* View Details Modal */}
			<Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Record Details</DialogTitle>
					</DialogHeader>
					{selectedRecord && (
						<div className="space-y-4 pt-4">
							<div className="space-y-2">
								<p className="font-semibold">Record ID</p>
								<p className="rounded-md bg-muted p-2 text-sm text-muted-foreground break-all">
									{selectedRecord.recordId}
								</p>
							</div>
							<div className="space-y-2">
								<p className="font-semibold">Patient Email</p>
								<p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
									{getEmailFromPatientId(selectedRecord.patientId)}
								</p>
							</div>
							<div className="space-y-2">
								<p className="font-semibold">Details</p>
								<p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
									{selectedRecord.details}
								</p>
							</div>
							<div className="space-y-2">
								<p className="font-semibold">Created At</p>
								<p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
									{new Date(selectedRecord.createdAt).toLocaleString()}
								</p>
							</div>
							<DialogFooter className="!mt-6 flex justify-end gap-2">
								<Button
									variant="secondary"
									onClick={() => openDocument(selectedRecord.recordId)}
								>
									View Document
								</Button>
								<Button
									variant="outline"
									onClick={() => setIsViewModalOpen(false)}
								>
									Close
								</Button>
							</DialogFooter>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Grant Consent Modal */}
			<Dialog open={isConsentModalOpen} onOpenChange={setIsConsentModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Grant Consent to a Doctor</DialogTitle>
						<DialogDescription>
							Select a doctor from the list to grant them access to this record.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<Select
							onValueChange={setSelectedDoctorId}
							value={selectedDoctorId}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a doctor..." />
							</SelectTrigger>
							<SelectContent>
								{doctors.length > 0 ? (
									doctors.map((doctor) => (
										<SelectItem key={doctor.id} value={doctor.id}>
											{doctor.name}
										</SelectItem>
									))
								) : (
									<p className="p-4 text-sm text-muted-foreground">
										No doctors available.
									</p>
								)}
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsConsentModalOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleGrantConsent} disabled={isSubmitting}>
							{isSubmitting ? "Granting..." : "Grant Consent"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* PDF Viewer Modal */}
			{pdfUrl && (
				<PDFViewer
					fileUrl={pdfUrl}
					isOpen={isPdfViewerOpen}
					onClose={() => {
						setIsPdfViewerOpen(false)
						setPdfUrl(null)
					}}
				/>
			)}
		</div>
	)
}
