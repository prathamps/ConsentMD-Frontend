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
import { forgotPassword } from "@/services/auth.service"
import { toast } from "sonner"
import { AxiosError } from "axios"

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
})

export default function ForgotPasswordForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await forgotPassword(values)
			toast.success("Password reset link sent! Please check your email.")
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
					<CardTitle className="text-xl">Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to receive a password reset link.
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
							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Remembered your password?{" "}
						<Link href="/login" className="underline">
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
