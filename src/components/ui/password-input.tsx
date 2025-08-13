"use client"

import * as React from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	showStrengthIndicator?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, showStrengthIndicator = false, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false)
		const [password, setPassword] = React.useState("")

		const togglePasswordVisibility = () => setShowPassword(!showPassword)

		const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(e.target.value)
			props.onChange?.(e)
		}

		// Password strength criteria
		const criteria = [
			{
				label: "At least 8 characters",
				test: (pwd: string) => pwd.length >= 8,
			},
			{
				label: "Contains uppercase letter",
				test: (pwd: string) => /[A-Z]/.test(pwd),
			},
			{
				label: "Contains lowercase letter",
				test: (pwd: string) => /[a-z]/.test(pwd),
			},
			{ label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
			{
				label: "Contains special character",
				test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
			},
		]

		const passedCriteria = criteria.filter((criterion) =>
			criterion.test(password)
		)
		const strengthPercentage = (passedCriteria.length / criteria.length) * 100

		const getStrengthColor = () => {
			if (strengthPercentage < 40) return "bg-red-500"
			if (strengthPercentage < 80) return "bg-yellow-500"
			return "bg-green-500"
		}

		const getStrengthText = () => {
			if (strengthPercentage < 40) return "Weak"
			if (strengthPercentage < 80) return "Medium"
			return "Strong"
		}

		return (
			<div className="space-y-2">
				<div className="relative">
					<Input
						{...props}
						ref={ref}
						type={showPassword ? "text" : "password"}
						className={cn("pr-10", className)}
						value={password}
						onChange={handlePasswordChange}
					/>
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>

				{showStrengthIndicator && password && (
					<div className="space-y-2">
						{/* Strength bar */}
						<div className="flex items-center space-x-2">
							<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									className={cn(
										"h-full transition-all duration-300",
										getStrengthColor()
									)}
									style={{ width: `${strengthPercentage}%` }}
								/>
							</div>
							<span className="text-xs font-medium text-gray-600">
								{getStrengthText()}
							</span>
						</div>

						{/* Criteria list */}
						<div className="grid grid-cols-1 gap-1 text-xs">
							{criteria.map((criterion, index) => {
								const passed = criterion.test(password)
								return (
									<div
										key={index}
										className={cn(
											"flex items-center space-x-2 transition-colors",
											passed ? "text-green-600" : "text-gray-400"
										)}
									>
										{passed ? (
											<Check className="h-3 w-3" />
										) : (
											<X className="h-3 w-3" />
										)}
										<span>{criterion.label}</span>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		)
	}
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
