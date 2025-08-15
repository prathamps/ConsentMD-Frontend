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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
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
				<header className="flex h-14 items-center gap-2 sm:gap-4 border-b bg-muted/40 px-2 sm:px-4 lg:h-[60px] lg:px-6">
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
						<SheetContent
							side="left"
							className="flex flex-col w-[280px] sm:w-[320px]"
						>
							<SheetHeader>
								<SheetTitle>Navigation Menu</SheetTitle>
							</SheetHeader>
							<Sidebar />
						</SheetContent>
					</Sheet>
					<div className="w-full flex-1">
						{/* Optional: Add a search bar or other header content here */}
					</div>
					<div className="flex items-center gap-1 sm:gap-2">
						<ModeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="secondary"
									size="icon"
									className="rounded-full"
								>
									<CircleUser className="h-5 w-5" />
									<span className="sr-only">Toggle user menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<p className="truncate">{user?.name}</p>
									<p className="text-xs text-muted-foreground font-normal truncate">
										{user?.email}
									</p>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</div>
		</div>
	)
}
