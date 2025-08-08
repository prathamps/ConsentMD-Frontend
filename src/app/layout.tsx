import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import StoreProvider from "@/store/StoreProvider"
import SessionProvider from "@/store/SessionProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Telemedicine Fabric",
	description: "Secure Telemedicine Platform",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<StoreProvider>
					<SessionProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster />
						</ThemeProvider>
					</SessionProvider>
				</StoreProvider>
			</body>
		</html>
	)
}
