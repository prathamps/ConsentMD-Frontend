"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setCredentials } from "@/store/authSlice"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

interface DecodedToken {
	sub: string
	name: string
	email: string
	role: string
	iat: number
	exp: number
}

type UserRole = "patient" | "doctor" | "admin"

const isUserRole = (role: string): role is UserRole => {
	return ["patient", "doctor", "admin"].includes(role)
}

export default function SessionProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const token = Cookies.get("accessToken")
		if (token) {
			try {
				const decodedToken = jwtDecode<DecodedToken>(token)
				if (
					isUserRole(decodedToken.role) &&
					decodedToken.exp * 1000 > Date.now()
				) {
					const user = {
						name: decodedToken.name,
						email: decodedToken.email,
						role: decodedToken.role,
					}
					dispatch(setCredentials({ user, token }))
				} else {
					// If token is expired, remove it
					Cookies.remove("accessToken")
				}
			} catch (error) {
				console.error("Invalid token:", error)
				// If token is invalid, remove it
				Cookies.remove("accessToken")
			}
		}
	}, [dispatch])

	return <>{children}</>
}
