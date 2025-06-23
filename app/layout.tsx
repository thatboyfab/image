import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { WebSocketProvider } from "@/lib/websocket-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "A2 Control - Mission Control Interface",
  description: "Command the Swarm - Interface for Recursive Intelligence",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WebSocketProvider>{children}</WebSocketProvider>
      </body>
    </html>
  )
}
