import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
	name: string
	email: string
	role: "patient" | "doctor" | "admin"
}

interface AuthState {
	user: User | null
	token: string | null
}

const initialState: AuthState = {
	user: null,
	token: null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials(
			state,
			action: PayloadAction<{ user: User; token: string }>
		) {
			state.user = action.payload.user
			state.token = action.payload.token
		},
		clearCredentials(state) {
			state.user = null
			state.token = null
		},
	},
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
