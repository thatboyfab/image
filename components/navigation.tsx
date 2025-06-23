"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Brain, Target, GitBranch, Settings } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"
import { LiveNotifications } from "@/components/live-notifications"

const navigation = [
  { name: "Missions", href: "/", icon: Target },
  { name: "Trace Viewer", href: "/trace", icon: GitBranch },
  { name: "Reflexion", href: "/reflexion", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-8">
      <nav className="flex space-x-8">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center space-x-4">
        <ConnectionStatus />
        <LiveNotifications />
      </div>
    </div>
  )
}
