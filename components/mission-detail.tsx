"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Activity, Clock, CheckCircle, AlertTriangle, Brain, GitBranch } from "lucide-react"
import Link from "next/link"

interface Subgoal {
  id: string
  description: string
  status: "pending" | "active" | "completed" | "failed"
  depth: number
  progress: number
  agents: number
  canRecurse: boolean
  cost: number
}

interface TimelineEvent {
  id: string
  timestamp: string
  type: "spawn" | "complete" | "error" | "replan"
  description: string
  subgoalId?: string
}

const mockSubgoals: Subgoal[] = [
  {
    id: "SG-001",
    description: "Analyze Q4 revenue streams",
    status: "completed",
    depth: 1,
    progress: 100,
    agents: 2,
    canRecurse: true,
    cost: 0.45,
  },
  {
    id: "SG-002",
    description: "Generate expense categorization",
    status: "active",
    depth: 1,
    progress: 78,
    agents: 3,
    canRecurse: true,
    cost: 0.32,
  },
  {
    id: "SG-003",
    description: "Forecast Q1 projections",
    status: "active",
    depth: 2,
    progress: 34,
    agents: 2,
    canRecurse: false,
    cost: 0.28,
  },
]

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "E-001",
    timestamp: "2024-01-15T10:30:00Z",
    type: "spawn",
    description: "Mission initialized with 3 primary subgoals",
  },
  {
    id: "E-002",
    timestamp: "2024-01-15T10:45:00Z",
    type: "spawn",
    description: "Subgoal SG-001 spawned 2 child tasks",
    subgoalId: "SG-001",
  },
  {
    id: "E-003",
    timestamp: "2024-01-15T11:20:00Z",
    type: "complete",
    description: "Revenue analysis completed successfully",
    subgoalId: "SG-001",
  },
]

export function MissionDetail({ missionId }: { missionId: string }) {
  const [subgoals] = useState<Subgoal[]>(mockSubgoals)
  const [timelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents)

  const getStatusIcon = (status: Subgoal["status"]) => {
    switch (status) {
      case "active":
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "spawn":
        return <GitBranch className="w-4 h-4 text-blue-400" />
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "replan":
        return <Brain className="w-4 h-4 text-purple-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Mission {missionId}</h1>
              <p className="text-slate-400">Fiscal Analysis Q4</p>
            </div>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="subgoals" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="subgoals" className="data-[state=active]:bg-slate-700">
              Subgoals
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-slate-700">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="reflexion" className="data-[state=active]:bg-slate-700">
              Reflexion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subgoals" className="space-y-4">
            <div className="grid gap-4">
              {subgoals.map((subgoal) => (
                <Card key={subgoal.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{subgoal.description}</h3>
                          {getStatusIcon(subgoal.status)}
                          <Badge variant="outline" className="text-slate-400">
                            Depth {subgoal.depth}
                          </Badge>
                          {subgoal.canRecurse && (
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Recursive</Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-slate-400 mb-4">
                          <span>ID: {subgoal.id}</span>
                          <span>{subgoal.agents} agents</span>
                          <span>Cost: ${subgoal.cost}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white">{subgoal.progress}%</span>
                            </div>
                            <Progress value={subgoal.progress} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Execution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-slate-700 rounded-full">{getEventIcon(event.type)}</div>
                        {index < timelineEvents.length - 1 && <div className="w-px h-8 bg-slate-600 mt-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{event.description}</span>
                          {event.subgoalId && (
                            <Badge variant="outline" className="text-xs">
                              {event.subgoalId}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflexion" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Reflexion Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">System Health: Optimal</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      All agents operating within expected parameters. No anomalies detected.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Learning Updates</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Knowledge graph updated with 3 new financial analysis patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
