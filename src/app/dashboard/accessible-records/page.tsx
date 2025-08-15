// /dashboard/accessible-records/page.tsx

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
import { AxiosError } from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { PDFViewer } from "@/components/pdf-viewer"
import { toast } from "sonner"

interface RecordData {
	docType: string
	recordId: string
	patientId: string
	details: string
	s3ObjectKey: string
	createdAt: string
}

interface AccessibleRecordItem {
	key: string
	record: RecordData
}

export default function AccessibleRecordsPage() {
	const [records, setRecords] = useState<AccessibleRecordItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false)
	const [pdfUrl, setPdfUrl] = useState<string | null>(null)

	// Function to parse the patient's email from the long ID string
	const getEmailFromPatientId = (patientId: string) => {
		const match = patientId.match(/CN=([^:]+)/)
		return match ? match[1] : "N/A"
	}

	useEffect(() => {
		const fetchRecords = async () => {
			setIsLoading(true)
			try {
				const response = await api.get("/records/accessible")
				setRecords(response.data.payload || [])
				setError(null)
			} catch (err) {
				const error = err as AxiosError
				setError(
					(error.response?.data as { message: string })?.message ||
						"Failed to fetch accessible records."
				)
			} finally {
				setIsLoading(false)
			}
		}

		fetchRecords()
	}, [])

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

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile Card View */}
			<div className="block sm:hidden space-y-4">
				<h1 className="text-xl font-bold">Accessible Medical Records</h1>
				{isLoading ? (
					Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-1/3" />
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
				) : records.length > 0 ? (
					records.map((item) => (
						<Card key={item.key}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<p className="font-medium truncate">
											{getEmailFromPatientId(item.record.patientId)}
										</p>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{item.record.details}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(item.record.createdAt).toLocaleDateString()}
										</p>
									</div>
									<Button
										variant="outline"
										onClick={() => openDocument(item.record.recordId)}
										className="w-full"
									>
										View Document
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-4 text-center">
							No records have been shared with you.
						</CardContent>
					</Card>
				)}
			</div>

			{/* Desktop Table View */}
			<Card className="hidden sm:block">
				<CardHeader>
					<CardTitle>Accessible Medical Records</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Patient</TableHead>
									<TableHead>Details</TableHead>
									<TableHead>Created At</TableHead>
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
										<TableCell>
											<Skeleton className="h-4 w-[150px]" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-8 w-[70px]" />
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center text-red-500">
											{error}
										</TableCell>
									</TableRow>
								) : records.length > 0 ? (
									records.map((item) => (
										<TableRow key={item.key}>
											<TableCell className="font-medium">
												{getEmailFromPatientId(item.record.patientId)}
											</TableCell>
											<TableCell className="max-w-xs truncate">
												{item.record.details}
											</TableCell>
											<TableCell>
												{new Date(item.record.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="outline"
													size="sm"
													onClick={() => openDocument(item.record.recordId)}
												>
													View
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} className="text-center">
											No records have been shared with you.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
			{isPdfViewerOpen && pdfUrl && (
				<PDFViewer
					fileUrl={pdfUrl}
					onClose={() => setIsPdfViewerOpen(false)}
					isOpen={isPdfViewerOpen}
				/>
			)}
		</div>
	)
}
