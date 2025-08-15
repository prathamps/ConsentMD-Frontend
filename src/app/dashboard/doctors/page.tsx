"use client"

import { useState, useEffect, useMemo } from "react"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Stethoscope } from "lucide-react"
import { AxiosError } from "axios"
import { Skeleton } from "@/components/ui/skeleton"

interface Doctor {
	id: string
	name: string
	email: string
	specialization?: string
}

export default function DoctorsPage() {
	const [doctors, setDoctors] = useState<Doctor[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedSpec, setSelectedSpec] = useState("all")

	useEffect(() => {
		const fetchDoctors = async () => {
			setIsLoading(true)
			try {
				const response = await api.get("/users/doctors", {
					params: { page: 1, size: 100 },
				})
				setDoctors(response.data.docs || [])
			} catch (err) {
				setError("Failed to fetch doctors.")
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchDoctors()
	}, [])

	const specializations = useMemo(() => {
		const specs = new Set(
			doctors.map((d) => d.specialization).filter(Boolean) as string[]
		)
		return ["all", ...Array.from(specs)]
	}, [doctors])

	const filteredDoctors = useMemo(() => {
		return doctors
			.filter((doc) =>
				doc.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.filter(
				(doc) => selectedSpec === "all" || doc.specialization === selectedSpec
			)
	}, [doctors, searchTerm, selectedSpec])

	const handleRequestConsultation = async (doctorId: string) => {
		try {
			await api.post("/consultations", { doctorId })
			toast.success("Consultation request sent successfully!")
		} catch (err) {
			const error = err as AxiosError<{ message: string }>
			toast.error(
				error.response?.data?.message || "Failed to send consultation request."
			)
		}
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold">Find a Doctor</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Browse the list of available doctors and request a consultation.
					</p>
				</div>
				<Stethoscope className="h-6 w-6 hidden sm:block" />
			</div>

			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
				<Input
					placeholder="Search by name..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full sm:max-w-sm"
				/>
				<Select value={selectedSpec} onValueChange={setSelectedSpec}>
					<SelectTrigger className="w-full sm:w-[200px]">
						<SelectValue placeholder="Filter by specialization" />
					</SelectTrigger>
					<SelectContent>
						{specializations.map((spec) => (
							<SelectItem key={spec} value={spec}>
								{spec === "all" ? "All Specializations" : spec}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Mobile Card View */}
			<div className="block sm:hidden space-y-4">
				{isLoading ? (
					Array.from({ length: 5 }).map((_, i) => (
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
				) : filteredDoctors.length > 0 ? (
					filteredDoctors.map((doctor) => (
						<Card key={doctor.id}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<p className="font-medium">{doctor.name}</p>
										<p className="text-sm text-muted-foreground">
											{doctor.specialization || "General Practice"}
										</p>
									</div>
									<Button
										onClick={() => handleRequestConsultation(doctor.id)}
										className="w-full"
									>
										Request Consultation
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-4 text-center">
							No doctors found matching your criteria.
						</CardContent>
					</Card>
				)}
			</div>

			{/* Desktop Table View */}
			<div className="hidden sm:block border rounded-md">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Specialization</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								[...Array(5)].map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-40" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-10 w-44" />
										</TableCell>
									</TableRow>
								))
							) : error ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center text-red-500">
										{error}
									</TableCell>
								</TableRow>
							) : filteredDoctors.length > 0 ? (
								filteredDoctors.map((doctor) => (
									<TableRow key={doctor.id}>
										<TableCell className="font-medium">{doctor.name}</TableCell>
										<TableCell>
											{doctor.specialization || "General Practice"}
										</TableCell>
										<TableCell className="text-right">
											<Button
												onClick={() => handleRequestConsultation(doctor.id)}
											>
												Request Consultation
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={3} className="text-center">
										No doctors found matching your criteria.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
