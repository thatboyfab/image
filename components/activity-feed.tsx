"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, GitBranch, Brain, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-context"

interface ActivityEvent {
  id: string
  type: "mission" | "agent" | "subgoal" | "system" | "trace"
  action: string
  description: string
  timestamp: string
  severity?: "low" | "medium" | "high"
  entityId?: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const { subscribe } = useWebSocket()
  const unsubscribersRef = useRef<(() => void)[]>([])

  useEffect(() => {
    // Clear previous subscriptions
    unsubscribersRef.current.forEach((unsub) => unsub())
    unsubscribersRef.current = []

    const unsubscribeMission = subscribe("mission_update", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "mission",
        action: data.status === "completed" ? "completed" : "updated",
        description: `Mission ${data.missionId} ${data.status === "completed" ? "completed successfully" : `progress updated to ${data.progress}%`}`,
        timestamp: new Date().toISOString(),
        entityId: data.missionId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeAgent = subscribe("agent_status", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "agent",
        action: data.status,
        description: `Agent ${data.agentId} status changed to ${data.status}`,
        timestamp: new Date().toISOString(),
        severity: data.status === "error" ? "high" : "low",
        entityId: data.agentId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeSubgoal = subscribe("subgoal_progress", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "subgoal",
        action: "progress",
        description: `Subgoal ${data.subgoalId} progress updated to ${data.progress}%`,
        timestamp: new Date().toISOString(),
        entityId: data.subgoalId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeAlert = subscribe("system_alert", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "system",
        action: "alert",
        description: data.message,
        timestamp: new Date().toISOString(),
        severity: data.severity,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeTrace = subscribe("trace_event", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "trace",
        action: data.event,
        description: `Node ${data.nodeId} ${data.event} event${data.parentId ? ` from ${data.parentId}` : ""}`,
        timestamp: new Date().toISOString(),
        entityId: data.nodeId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    // Store unsubscribers
    unsubscribersRef.current = [
      unsubscribeMission,
      unsubscribeAgent,
      unsubscribeSubgoal,
      unsubscribeAlert,
      unsubscribeTrace,
    ]

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub())
      unsubscribersRef.current = []
    }
  }, [subscribe])

  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case "mission":
        return action === "completed" ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Activity className="w-4 h-4 text-blue-400" />
        )
      case "agent":
        return action === "error" ? (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        ) : (
          <Brain className="w-4 h-4 text-purple-400" />
        )
      case "subgoal":
        return <GitBranch className="w-4 h-4 text-yellow-400" />
      case "system":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case "trace":
        return <Zap className="w-4 h-4 text-cyan-400" />
      default:
        return <Activity className="w-4 h-4 text-slate-400" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Live Activity Feed</span>
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 ml-auto">{activities.length} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {activities.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No recent activity</div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-700/30">
                  {getActivityIcon(activity.type, activity.action)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                      {activity.severity && (
                        <Badge className={`text-xs ${getSeverityColor(activity.severity)} border`}>
                          {activity.severity}
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{activity.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
