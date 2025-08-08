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
		<div className="flex items-center justify-center min-h-screen">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" {...field} />
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
										<div className="flex items-center">
											<FormLabel>Password</FormLabel>
											<Link
												href="/forgot-password"
												className="ml-auto inline-block text-sm underline"
											>
												Forgot your password?
											</Link>
										</div>
										<FormControl>
											<Input type="password" {...field} />
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
								{form.formState.isSubmitting ? "Logging in..." : "Login"}
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
