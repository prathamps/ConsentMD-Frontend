"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import api from "@/services/api"
import axios from "axios"

interface CreateRecordModalProps {
	isOpen: boolean
	onClose: () => void
	patientId: string
	onRecordCreated: () => void
}

export default function CreateRecordModal({
	isOpen,
	onClose,
	patientId,
	onRecordCreated,
}: CreateRecordModalProps) {
	const [symptoms, setSymptoms] = useState("")
	const [diagnosis, setDiagnosis] = useState("")
	const [treatment, setTreatment] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0])
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!file) {
			setError("Please select a file.")
			return
		}

		setIsSubmitting(true)
		setError(null)

		const formData = new FormData()
		formData.append("patientId", patientId)
		formData.append(
			"details",
			JSON.stringify({ symptoms, diagnosis, treatment })
		)
		formData.append("file", file)

		try {
			await api.post("/records/by-doctor", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			onRecordCreated()
			onClose()
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data.message || "An unexpected error occurred.")
			} else {
				setError("Failed to create medical record.")
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Medical Record</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new medical record for the patient.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="symptoms" className="text-right">
								Symptoms
							</Label>
							<Textarea
								id="symptoms"
								value={symptoms}
								onChange={(e) => setSymptoms(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="diagnosis" className="text-right">
								Diagnosis
							</Label>
							<Textarea
								id="diagnosis"
								value={diagnosis}
								onChange={(e) => setDiagnosis(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="treatment" className="text-right">
								Treatment
							</Label>
							<Textarea
								id="treatment"
								value={treatment}
								onChange={(e) => setTreatment(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="file" className="text-right">
								Record File
							</Label>
							<Input
								id="file"
								type="file"
								onChange={handleFileChange}
								className="col-span-3"
							/>
						</div>
						{error && (
							<p className="text-red-500 text-sm col-span-4">{error}</p>
						)}
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create Record"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
