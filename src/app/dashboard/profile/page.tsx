"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/services/api"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppSelector } from "@/store/hooks"

type ProfileFormData = {
	name: string
	specialization: string
}

export default function ProfilePage() {
	const { user } = useAppSelector((state) => state.auth)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<ProfileFormData>({
		defaultValues: {
			name: user?.name || "",
			specialization: "",
		},
	})

	useEffect(() => {
		const fetchProfile = async () => {
			setIsLoading(true)
			try {
				const response = await api.get("/users/profile/doctor")
				reset(response.data)
				setError(null)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response?.status !== 404) {
					setError(
						err.response?.data.message || "An unexpected error occurred."
					)
				}
				// If 404, it just means the profile isn't created yet, so we use existing form defaults.
			} finally {
				setIsLoading(false)
			}
		}

		fetchProfile()
	}, [reset])

	const onSubmit = async (data: ProfileFormData) => {
		setIsSubmitting(true)
		setError(null)
		setSuccessMessage(null)
		try {
			// Using POST as per Postman collection to create/update profile
			await api.post("/users/profile/doctor", data)
			setSuccessMessage("Profile updated successfully!")
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data.message || "An unexpected error occurred.")
			} else {
				setError("Failed to update profile.")
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-8 w-1/3" />
					<Skeleton className="h-4 w-2/3" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-24" />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>My Profile</CardTitle>
				<CardDescription>
					Update your professional profile information. This will be visible to
					patients.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Controller
							name="name"
							control={control}
							render={({ field }) => <Input id="name" {...field} />}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<Input id="email" type="email" value={user?.email || ""} disabled />
					</div>
					<div className="space-y-2">
						<Label htmlFor="specialization">Specialization</Label>
						<Controller
							name="specialization"
							control={control}
							render={({ field }) => <Input id="specialization" {...field} />}
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}
					{successMessage && (
						<p className="text-green-500 text-sm">{successMessage}</p>
					)}
					<Button type="submit" disabled={isSubmitting || !isDirty}>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
