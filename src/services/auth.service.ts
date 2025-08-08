import api from "./api"
import { store } from "@/store/store"
import { InternalAxiosRequestConfig, AxiosError } from "axios"

// Define public routes that should not receive the auth token
const publicRoutes = [
	"/auth/login",
	"/auth/register",
	"/auth/forgot-password",
	"/auth/reset-password",
]

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Check if the request URL is for a public route
		if (config.url && publicRoutes.includes(config.url)) {
			return config // Don't add the token for public routes
		}

		const token = store.getState().auth.token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error: AxiosError) => {
		return Promise.reject(error)
	}
)

interface LoginCredentials {
	email: string
	password: string
}

export const login = async (credentials: LoginCredentials) => {
	const response = await api.post("/auth/login", credentials)
	return response.data
}

interface RegisterUserData {
	name: string
	email: string
	password: string
	role: "patient" | "doctor"
	orgId: number
	organization: string
}

export const register = async (userData: RegisterUserData) => {
	const response = await api.post("/auth/register", userData)
	return response.data
}

export const forgotPassword = async (email: { email: string }) => {
	const response = await api.post("/auth/forgot-password", email)
	return response.data
}

export const resetPassword = async (data: {
	token: string
	password: string
}) => {
	const response = await api.post(`/auth/reset-password?token=${data.token}`, {
		password: data.password,
	})
	return response.data
}
