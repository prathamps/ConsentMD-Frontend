"use client"
import { Provider } from "react-redux"
import { store } from "./store"
import { ReactNode } from "react"

export default function StoreProvider({ children }: { children: ReactNode }) {
	return <Provider store={store}>{children}</Provider>
}
