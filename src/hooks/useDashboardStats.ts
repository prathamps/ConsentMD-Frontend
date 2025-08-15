import { useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setStats, setLoading } from "@/store/dashboardSlice"
import api from "@/services/api"

interface ConsentRecord {
	consentId: string
	docType: string
	doctorId: string
	grantedAt: string
	patientId: string
	recordId: string
	revokedAt: string | null
	status: string
}

interface ConsentItem {
	key: string
	record: ConsentRecord
}

export const useDashboardStats = () => {
	const { user } = useAppSelector((state) => state.auth)
	const { stats, isLoading } = useAppSelector((state) => state.dashboard)
	const dispatch = useAppDispatch()

	const fetchStats = useCallback(async () => {
		if (!user?.role) {
			dispatch(setLoading(false))
			return
		}

		dispatch(setLoading(true))
		try {
			if (user.role === "patient") {
				const [recordsRes, consentsRes, consultationsRes] = await Promise.all([
					api.get("/records/mine"),
					api.get("/records/consents/mine"),
					api.get("/consultations/mine"),
				])

				const rawConsents: ConsentItem[] = consentsRes.data.payload || []
				const activeConsents = rawConsents.filter(
					(c) => c.record.status === "granted"
				)
				const uniqueConsentsMap = new Map<string, ConsentItem>()
				activeConsents.forEach((consent) => {
					const key = `${consent.record.recordId}-${consent.record.doctorId}`
					const existing = uniqueConsentsMap.get(key)
					if (
						!existing ||
						new Date(consent.record.grantedAt) >
							new Date(existing.record.grantedAt)
					) {
						uniqueConsentsMap.set(key, consent)
					}
				})

				dispatch(
					setStats({
						records: recordsRes.data.payload?.length || 0,
						consents: uniqueConsentsMap.size,
						consultations:
							consultationsRes.data.payload?.filter(
								(c: { status: string }) => c.status === "pending"
							).length || 0,
					})
				)
			} else if (user.role === "doctor") {
				const [requestsRes, patientsRes, accessibleRecordsRes] =
					await Promise.all([
						api.get("/consultations/requests"),
						api.get("/users/assigned-patients"),
						api.get("/records/accessible"),
					])

				// Filter for only pending requests
				const pendingRequests =
					requestsRes.data.payload?.filter(
						(request: { status: string }) => request.status === "pending"
					) || []

				dispatch(
					setStats({
						requests: pendingRequests.length,
						patients: patientsRes.data?.length || 0,
						accessibleRecords: accessibleRecordsRes.data.payload?.length || 0,
					})
				)
			}
		} catch (error) {
			console.error(`Failed to fetch ${user.role} dashboard stats:`, error)
		} finally {
			dispatch(setLoading(false))
		}
	}, [user, dispatch])

	return {
		stats,
		isLoading,
		fetchStats,
	}
}
