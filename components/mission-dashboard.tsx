"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Activity, Clock, CheckCircle, AlertTriangle, Zap, Brain, Target } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useWebSocket } from "@/lib/websocket-context"
import { SystemHealthMonitor } from "@/components/system-health-monitor"
import { ActivityFeed } from "@/components/activity-feed"

interface Mission {
  id: string
  name: string
  description: string
  status: "active" | "queued" | "completed" | "failed"
  priority: "low" | "medium" | "high" | "critical"
  progress: number
  subgoals: number
  agents: number
  createdAt: string
  traceId: string
}

const mockMissions: Mission[] = [
  {
    id: "MG-001",
    name: "Fiscal Analysis Q4",
    description: "Comprehensive financial analysis and forecasting for Q4 performance",
    status: "active",
    priority: "high",
    progress: 67,
    subgoals: 12,
    agents: 8,
    createdAt: "2024-01-15T10:30:00Z",
    traceId: "trace-001-fiscal",
  },
  {
    id: "MG-002",
    name: "Market Research Initiative",
    description: "Deep market analysis for emerging AI technologies",
    status: "active",
    priority: "medium",
    progress: 34,
    subgoals: 8,
    agents: 5,
    createdAt: "2024-01-15T14:20:00Z",
    traceId: "trace-002-market",
  },
  {
    id: "MG-003",
    name: "Compliance Audit",
    description: "Automated compliance checking across all systems",
    status: "completed",
    priority: "critical",
    progress: 100,
    subgoals: 15,
    agents: 12,
    createdAt: "2024-01-14T09:15:00Z",
    traceId: "trace-003-compliance",
  },
]

export function MissionDashboard() {
  const [missions, setMissions] = useState<Mission[]>(mockMissions)
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false)
  const [newMission, setNewMission] = useState({
    name: "",
    description: "",
    priority: "medium" as const,
    timeRange: "24h",
  })

  const { subscribe } = useWebSocket()
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    unsubscribeRef.current = subscribe("mission_update", (data) => {
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === data.missionId ? { ...mission, progress: data.progress, status: data.status } : mission,
        ),
      )
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [subscribe])

  const getStatusIcon = (status: Mission["status"]) => {
    switch (status) {
      case "active":
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case "queued":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Mission["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "queued":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  const getPriorityColor = (priority: Mission["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-500/10 text-gray-500"
      case "medium":
        return "bg-blue-500/10 text-blue-500"
      case "high":
        return "bg-orange-500/10 text-orange-500"
      case "critical":
        return "bg-red-500/10 text-red-500"
    }
  }

  const handleCreateMission = () => {
    const mission: Mission = {
      id: `MG-${String(missions.length + 1).padStart(3, "0")}`,
      name: newMission.name,
      description: newMission.description,
      status: "queued",
      priority: newMission.priority,
      progress: 0,
      subgoals: 0,
      agents: 0,
      createdAt: new Date().toISOString(),
      traceId: `trace-${Date.now()}`,
    }

    setMissions([mission, ...missions])
    setNewMission({ name: "", description: "", priority: "medium", timeRange: "24h" })
    setIsNewMissionOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">A2 Control</h1>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                Mission Control Interface
              </Badge>
              <Navigation />
            </div>

            <Dialog open={isNewMissionOpen} onOpenChange={setIsNewMissionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Mission
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Mission</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      Mission Name
                    </Label>
                    <Input
                      id="name"
                      value={newMission.name}
                      onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter mission name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newMission.description}
                      onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Describe the mission objectives"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority" className="text-slate-300">
                        Priority
                      </Label>
                      <Select
                        value={newMission.priority}
                        onValueChange={(value: any) => setNewMission({ ...newMission, priority: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeRange" className="text-slate-300">
                        Time Range
                      </Label>
                      <Select
                        value={newMission.timeRange}
                        onValueChange={(value) => setNewMission({ ...newMission, timeRange: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateMission}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!newMission.name || !newMission.description}
                  >
                    Initialize Mission
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Missions</p>
                  <p className="text-2xl font-bold text-white">
                    {missions.filter((m) => m.status === "active").length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-white">{missions.reduce((acc, m) => acc + m.agents, 0)}</p>
                </div>
                <Brain className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Subgoals</p>
                  <p className="text-2xl font-bold text-white">{missions.reduce((acc, m) => acc + m.subgoals, 0)}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add this after the stats overview grid */}
        {/* Replace the single SystemHealthMonitor with a grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SystemHealthMonitor />
          <ActivityFeed />
        </div>

        {/* Mission Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Mission Overview</h2>
          {missions.map((mission) => (
            <Card
              key={mission.id}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{mission.name}</h3>
                      <Badge className={`${getStatusColor(mission.status)} border`}>
                        {getStatusIcon(mission.status)}
                        <span className="ml-1 capitalize">{mission.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(mission.priority)}>{mission.priority.toUpperCase()}</Badge>
                    </div>
                    <p className="text-slate-400 mb-4">{mission.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <span>ID: {mission.id}</span>
                      <span>Trace: {mission.traceId}</span>
                      <span>{mission.subgoals} subgoals</span>
                      <span>{mission.agents} agents</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">{mission.progress}%</div>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
