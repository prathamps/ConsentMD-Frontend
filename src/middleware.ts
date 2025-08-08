import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
	exp: number
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const token = request.cookies.get("accessToken")?.value

	const isPublicPath =
		path === "/login" ||
		path === "/register" ||
		path === "/forgot-password" ||
		path === "/reset-password"

	const isDashboardRoute = path.startsWith("/dashboard")

	// 1. Handle public paths
	if (isPublicPath) {
		if (token) {
			try {
				const decoded: DecodedToken = jwtDecode(token)
				if (decoded.exp * 1000 > Date.now()) {
					return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
				}
			} catch {
				// Invalid token, let them proceed to the public path (e.g., login)
			}
		}
		return NextResponse.next()
	}

	// 2. Handle protected dashboard routes
	if (isDashboardRoute) {
		if (!token) {
			return NextResponse.redirect(new URL("/login", request.nextUrl))
		}

		try {
			const decoded: DecodedToken = jwtDecode(token)
			if (decoded.exp * 1000 < Date.now()) {
				const response = NextResponse.redirect(
					new URL("/login", request.nextUrl)
				)
				response.cookies.delete("accessToken")
				return response
			}
		} catch {
			const response = NextResponse.redirect(new URL("/login", request.nextUrl))
			response.cookies.delete("accessToken")
			return response
		}

		return NextResponse.next()
	}

	// 3. Handle the root path "/"
	if (path === "/") {
		if (token) {
			try {
				const decoded: DecodedToken = jwtDecode(token)
				if (decoded.exp * 1000 > Date.now()) {
					return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
				}
			} catch {
				// Invalid token, let them see the homepage
			}
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/register",
		"/forgot-password",
		"/reset-password",
		"/dashboard/:path*",
	],
}
