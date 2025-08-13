"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

import Link from "next/link"
import { register } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
import * as React from "react"

const formSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: "Full name must be at least 2 characters" }),
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.regex(/[A-Z]/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/[a-z]/, {
				message: "Password must contain at least one lowercase letter",
			})
			.regex(/\d/, { message: "Password must contain at least one number" })
			.regex(/[!@#$%^&*(),.?":{}|<>]/, {
				message: "Password must contain at least one special character",
			}),
		confirmPassword: z.string(),
		role: z.enum(["patient", "doctor"], {
			required_error: "You need to select a role.",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

export default function RegisterForm() {
	const router = useRouter()
	const [selectedRole, setSelectedRole] = React.useState<"patient" | "doctor">(
		"patient"
	)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "patient",
		},
	})

	// Update form when role changes
	React.useEffect(() => {
		form.setValue("role", selectedRole)
	}, [selectedRole, form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const userData = {
				...values,
				orgId: values.role === "doctor" ? 1 : 2,
				organization: values.role,
			}
			await register(userData)
			toast.success("Registration successful! Please login.")
			router.push("/login")
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message || "An error occurred.")
			} else {
				toast.error("An unexpected error occurred.")
			}
		}
	}

	return (
		<div className="relative flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
			{/* Background decoration matching landing page */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
			</div>

			<Card className="w-full max-w-lg mx-auto border-border/50 shadow-sm">
				<CardHeader className="space-y-4 text-center pb-6">
					<CardTitle className="text-2xl font-bold tracking-tight">
						Join ConsentMD
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Create your account and start your healthcare journey
					</CardDescription>

					{/* Role Toggle Buttons */}
					<div className="flex items-center justify-center p-1 bg-muted rounded-lg">
						<Button
							type="button"
							variant={selectedRole === "patient" ? "default" : "ghost"}
							size="sm"
							className="flex-1 h-9"
							onClick={() => setSelectedRole("patient")}
						>
							Patient
						</Button>
						<Button
							type="button"
							variant={selectedRole === "doctor" ? "default" : "ghost"}
							size="sm"
							className="flex-1 h-9"
							onClick={() => setSelectedRole("doctor")}
						>
							Doctor
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter your full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your email address"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder="Create a strong password"
												showStrengthIndicator={true}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder="Confirm your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full mt-6"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span>Creating account...</span>
									</div>
								) : (
									`Create ${selectedRole} account`
								)}
							</Button>
						</form>
					</Form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Already have an account?
							</span>
						</div>
					</div>

					<div className="text-center">
						<Link
							href="/login"
							className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 font-medium"
						>
							Sign in instead
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
