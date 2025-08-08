"use client"

import { CircleUser, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./_components/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { clearCredentials } from "@/store/authSlice"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const { user } = useAppSelector((state) => state.auth)

	const handleLogout = () => {
		dispatch(clearCredentials())
		Cookies.remove("accessToken")
		router.push("/login")
	}

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<Sidebar />
			</div>
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<Sidebar />
						</SheetContent>
					</Sheet>
					<div className="w-full flex-1">
						{/* Optional: Add a search bar or other header content here */}
					</div>
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="icon" className="rounded-full">
								<CircleUser className="h-5 w-5" />
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								<p>{user?.name}</p>
								<p className="text-xs text-muted-foreground font-normal">
									{user?.email}
								</p>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</div>
		</div>
	)
}
