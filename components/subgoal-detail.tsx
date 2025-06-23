"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  GitBranch,
  Brain,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface SubgoalDetail {
  id: string
  description: string
  status: "pending" | "active" | "completed" | "failed"
  depth: number
  progress: number
  canRecurse: boolean
  cost: number
  parentId?: string
  childrenIds: string[]
  assignedAgents: {
    id: string
    name: string
    role: string
    status: "active" | "idle"
  }[]
  breadcrumbs: {
    id: string
    name: string
    depth: number
  }[]
  metrics: {
    startTime: string
    estimatedCompletion?: string
    actualCompletion?: string
    retries: number
    spawns: number
  }
}

const mockSubgoal: SubgoalDetail = {
  id: "SG-002",
  description: "Generate expense categorization for Q4 financial analysis",
  status: "active",
  depth: 2,
  progress: 78,
  canRecurse: true,
  cost: 0.32,
  parentId: "SG-001",
  childrenIds: ["SG-004", "SG-005"],
  assignedAgents: [
    { id: "AGT-001", name: "Financial Analyzer Alpha", role: "Data Analysis", status: "active" },
    { id: "AGT-003", name: "Pattern Recognition Beta", role: "ML Specialist", status: "active" },
    { id: "AGT-007", name: "Report Generator Gamma", role: "Documentation", status: "idle" },
  ],
  breadcrumbs: [
    { id: "MG-001", name: "Fiscal Analysis Q4", depth: 0 },
    { id: "SG-001", name: "Revenue Analysis", depth: 1 },
    { id: "SG-002", name: "Expense Categorization", depth: 2 },
  ],
  metrics: {
    startTime: "2024-01-15T10:45:00Z",
    estimatedCompletion: "2024-01-15T12:30:00Z",
    retries: 1,
    spawns: 2,
  },
}

export function SubgoalDetail({ subgoalId }: { subgoalId: string }) {
  const [subgoal] = useState<SubgoalDetail>(mockSubgoal)

  const getStatusIcon = (status: SubgoalDetail["status"]) => {
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

  const getAgentStatusColor = (status: string) => {
    return status === "active" ? "text-green-400" : "text-yellow-400"
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
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {subgoal.breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center space-x-2">
                    <span className="text-slate-400 text-sm">{crumb.name}</span>
                    {index < subgoal.breadcrumbs.length - 1 && <span className="text-slate-600">/</span>}
                  </div>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-white">{subgoal.description}</h1>
            </div>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              {getStatusIcon(subgoal.status)}
              <span className="ml-1 capitalize">{subgoal.status}</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Recursion Depth</p>
                  <p className="text-2xl font-bold text-white">{subgoal.depth}</p>
                </div>
                <GitBranch className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Assigned Agents</p>
                  <p className="text-2xl font-bold text-white">{subgoal.assignedAgents.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Cost Incurred</p>
                  <p className="text-2xl font-bold text-white">${subgoal.cost}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Child Spawns</p>
                  <p className="text-2xl font-bold text-white">{subgoal.metrics.spawns}</p>
                </div>
                <Brain className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress & Status */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Execution Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white">{subgoal.progress}%</span>
                </div>
                <Progress value={subgoal.progress} className="h-3" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Started</span>
                  <span className="text-white">{new Date(subgoal.metrics.startTime).toLocaleString()}</span>
                </div>
                {subgoal.metrics.estimatedCompletion && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Completion</span>
                    <span className="text-white">{new Date(subgoal.metrics.estimatedCompletion).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Retries</span>
                  <span className="text-white">{subgoal.metrics.retries}</span>
                </div>
              </div>

              {subgoal.canRecurse && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-medium">Recursive Capability Enabled</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">This subgoal can spawn additional child tasks as needed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Agents */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Assigned Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subgoal.assignedAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{agent.name}</h4>
                      <p className="text-slate-400 text-sm">{agent.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getAgentStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                      <Link href={`/agents/${agent.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-600">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hierarchy Visualization */}
          <Card className="bg-slate-800/50 border-slate-700/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Subgoal Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8 p-6">
                {/* Parent */}
                {subgoal.parentId && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mb-2">
                      <GitBranch className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400">Parent</p>
                    <p className="text-sm text-white">{subgoal.parentId}</p>
                  </div>
                )}

                {/* Arrow */}
                {subgoal.parentId && <div className="text-slate-600">→</div>}

                {/* Current */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-600/50 rounded-lg flex items-center justify-center mb-2">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-xs text-blue-400">Current</p>
                  <p className="text-sm text-white font-medium">{subgoal.id}</p>
                </div>

                {/* Arrow */}
                {subgoal.childrenIds.length > 0 && <div className="text-slate-600">→</div>}

                {/* Children */}
                {subgoal.childrenIds.length > 0 && (
                  <div className="flex space-x-4">
                    {subgoal.childrenIds.map((childId) => (
                      <div key={childId} className="text-center">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mb-2">
                          <GitBranch className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-400">Child</p>
                        <p className="text-sm text-white">{childId}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
