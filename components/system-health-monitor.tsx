"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, Database, Network } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-context"

interface SystemMetrics {
  cpu: number
  memory: number
  network: number
  database: number
  overall: number
  activeConnections: number
  throughput: number
}

export function SystemHealthMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    network: 89,
    database: 92,
    overall: 73,
    activeConnections: 24,
    throughput: 1247,
  })

  const { subscribe, isConnected } = useWebSocket()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const unsubscribe = subscribe("system_alert", (data) => {
      // Update metrics based on system alerts
      if (data.component === "A2-Engine-Core") {
        setMetrics((prev) => ({
          ...prev,
          overall: Math.max(0, prev.overall - 5),
        }))
      }
    })

    return unsubscribe
  }, [subscribe])

  // Simulate real-time metric updates
  useEffect(() => {
    if (!isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 6)),
        database: Math.max(0, Math.min(100, prev.database + (Math.random() - 0.5) * 4)),
        overall: Math.max(0, Math.min(100, prev.overall + (Math.random() - 0.5) * 3)),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 6)),
        throughput: Math.max(0, prev.throughput + Math.floor((Math.random() - 0.5) * 200)),
      }))
    }, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isConnected])

  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getHealthBadge = (value: number) => {
    if (value >= 80) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (value >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>System Health</span>
          <Badge className={`${getHealthBadge(metrics.overall)} border ml-auto`}>{metrics.overall.toFixed(0)}%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">CPU</span>
              </div>
              <span className={`text-sm font-medium ${getHealthColor(metrics.cpu)}`}>{metrics.cpu.toFixed(0)}%</span>
            </div>
            <Progress value={metrics.cpu} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Memory</span>
              </div>
              <span className={`text-sm font-medium ${getHealthColor(metrics.memory)}`}>
                {metrics.memory.toFixed(0)}%
              </span>
            </div>
            <Progress value={metrics.memory} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">Network</span>
              </div>
              <span className={`text-sm font-medium ${getHealthColor(metrics.network)}`}>
                {metrics.network.toFixed(0)}%
              </span>
            </div>
            <Progress value={metrics.network} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Database</span>
              </div>
              <span className={`text-sm font-medium ${getHealthColor(metrics.database)}`}>
                {metrics.database.toFixed(0)}%
              </span>
            </div>
            <Progress value={metrics.database} className="h-2" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Connections</span>
              <span className="text-white font-medium">{metrics.activeConnections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Throughput</span>
              <span className="text-white font-medium">{metrics.throughput.toLocaleString()}/s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
