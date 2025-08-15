import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface DashboardStats {
	records: number
	consents: number
	consultations: number
	requests: number
	patients: number
	accessibleRecords: number
}

interface DashboardState {
	stats: DashboardStats
	isLoading: boolean
}

const initialState: DashboardState = {
	stats: {
		records: 0,
		consents: 0,
		consultations: 0,
		requests: 0,
		patients: 0,
		accessibleRecords: 0,
	},
	isLoading: false,
}

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setStats(state, action: PayloadAction<Partial<DashboardStats>>) {
			state.stats = { ...state.stats, ...action.payload }
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload
		},
		decrementRequests(state) {
			if (state.stats.requests > 0) {
				state.stats.requests -= 1
			}
		},
		incrementPatients(state) {
			state.stats.patients += 1
		},
		resetStats(state) {
			state.stats = initialState.stats
		},
	},
})

export const {
	setStats,
	setLoading,
	decrementRequests,
	incrementPatients,
	resetStats,
} = dashboardSlice.actions
export default dashboardSlice.reducer
