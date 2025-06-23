"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-context"

export function ConnectionStatus() {
  const { connectionStatus, isConnected } = useWebSocket()

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-3 h-3" />
      case "connecting":
        return <RefreshCw className="w-3 h-3 animate-spin" />
      case "error":
        return <AlertTriangle className="w-3 h-3" />
      case "disconnected":
        return <WifiOff className="w-3 h-3" />
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "connecting":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "disconnected":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Badge className={`${getStatusColor()} border flex items-center space-x-1`}>
      {getStatusIcon()}
      <span className="capitalize">{connectionStatus}</span>
    </Badge>
  )
}
