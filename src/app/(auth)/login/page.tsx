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
import { login } from "@/services/auth.service"
import { useAppDispatch } from "@/store/hooks"
import { setCredentials } from "@/store/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(1, {
		message: "Password is required.",
	}),
})

export default function LoginForm() {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await login(values)
			const accessToken = response.payload.access.token

			// Decode the token to get user info
			const decodedUser = jwtDecode<{
				name: string
				email: string
				role: "patient" | "doctor" | "admin"
			}>(accessToken)
			const user = {
				name: decodedUser.name,
				email: decodedUser.email,
				role: decodedUser.role,
			}

			dispatch(setCredentials({ user, token: accessToken }))
			Cookies.set("accessToken", accessToken, { expires: 1 })
			localStorage.setItem("user", JSON.stringify(user))

			toast.success("Login successful!")
			router.push("/dashboard")
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

			<Card className="w-full max-w-md mx-auto border-border/50 shadow-sm">
				<CardHeader className="space-y-1 text-center pb-6">
					<CardTitle className="text-2xl font-bold tracking-tight">
						Welcome back
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
										<div className="flex items-center justify-between">
											<FormLabel>Password</FormLabel>
											<Link
												href="/forgot-password"
												className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
											>
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<PasswordInput
												placeholder="Enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span>Signing in...</span>
									</div>
								) : (
									"Sign in"
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
								New to ConsentMD?
							</span>
						</div>
					</div>

					<div className="text-center">
						<Link
							href="/register"
							className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 font-medium"
						>
							Create an account
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
