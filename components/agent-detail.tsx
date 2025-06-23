"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Cpu, Zap, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "terminated" | "error"
  currentTask: string
  capabilities: string[]
  performance: {
    tasksCompleted: number
    successRate: number
    avgLatency: number
    retries: number
  }
  learningPath: {
    step: string
    status: "completed" | "active" | "pending"
    timestamp?: string
  }[]
  config: {
    maxDepth: number
    budget: number
    timeout: number
  }
  logs: {
    timestamp: string
    level: "info" | "warn" | "error"
    message: string
  }[]
}

const mockAgent: Agent = {
  id: "AGT-001",
  name: "Financial Analyzer Alpha",
  role: "Data Analysis Specialist",
  status: "active",
  currentTask: "Processing Q4 revenue categorization",
  capabilities: ["Data Analysis", "Pattern Recognition", "Report Generation", "Recursive Delegation"],
  performance: {
    tasksCompleted: 47,
    successRate: 94.7,
    avgLatency: 2.3,
    retries: 3,
  },
  learningPath: [
    { step: "Initialize core capabilities", status: "completed", timestamp: "2024-01-15T10:30:00Z" },
    { step: "Load financial analysis patterns", status: "completed", timestamp: "2024-01-15T10:32:00Z" },
    { step: "Establish recursive protocols", status: "completed", timestamp: "2024-01-15T10:35:00Z" },
    { step: "Execute primary analysis task", status: "active", timestamp: "2024-01-15T10:40:00Z" },
    { step: "Generate comprehensive report", status: "pending" },
  ],
  config: {
    maxDepth: 5,
    budget: 10.0,
    timeout: 300,
  },
  logs: [
    { timestamp: "2024-01-15T11:45:23Z", level: "info", message: "Started revenue stream analysis" },
    { timestamp: "2024-01-15T11:45:45Z", level: "info", message: "Identified 12 primary revenue categories" },
    { timestamp: "2024-01-15T11:46:12Z", level: "warn", message: "Anomaly detected in Q3 comparison data" },
    { timestamp: "2024-01-15T11:46:30Z", level: "info", message: "Spawning specialized analysis agent for anomaly" },
    { timestamp: "2024-01-15T11:47:01Z", level: "info", message: "Recursive analysis completed successfully" },
  ],
}

export function AgentDetail({ agentId }: { agentId: string }) {
  const [agent] = useState<Agent>(mockAgent)
  const [logs, setLogs] = useState(agent.logs)

  // Simulate real-time log updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date().toISOString(),
        level: Math.random() > 0.8 ? "warn" : ("info" as const),
        message: [
          "Processing data chunk 47/120",
          "Pattern recognition confidence: 87.3%",
          "Delegating subtask to child agent",
          "Memory optimization completed",
          "Knowledge graph updated with new insights",
        ][Math.floor(Math.random() * 5)],
      }
      setLogs((prev) => [newLog, ...prev.slice(0, 19)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return <Activity className="w-4 h-4 text-green-500 animate-pulse" />
      case "idle":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "terminated":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "info":
        return <CheckCircle className="w-3 h-3 text-blue-400" />
      case "warn":
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />
      case "error":
        return <AlertTriangle className="w-3 h-3 text-red-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                <p className="text-slate-400">{agent.role}</p>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                {getStatusIcon(agent.status)}
                <span className="ml-1 capitalize">{agent.status}</span>
              </Badge>
            </div>

            <Button variant="destructive" size="sm">
              Terminate Agent
            </Button>
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
                  <p className="text-slate-400 text-sm">Tasks Completed</p>
                  <p className="text-2xl font-bold text-white">{agent.performance.tasksCompleted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{agent.performance.successRate}%</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Latency</p>
                  <p className="text-2xl font-bold text-white">{agent.performance.avgLatency}s</p>
                </div>
                <Cpu className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Retries</p>
                  <p className="text-2xl font-bold text-white">{agent.performance.retries}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning Path</TabsTrigger>
            <TabsTrigger value="logs">Live Logs</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Current Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{agent.currentTask}</p>
                  <Progress value={67} className="mb-2" />
                  <p className="text-sm text-slate-400">67% Complete</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability) => (
                      <Badge key={capability} variant="outline" className="text-blue-400 border-blue-400/30">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Learning Path Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agent.learningPath.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-2 rounded-full ${
                            step.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : step.status === "active"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-slate-600/20 text-slate-400"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : step.status === "active" ? (
                            <Activity className="w-4 h-4 animate-pulse" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        {index < agent.learningPath.length - 1 && <div className="w-px h-8 bg-slate-600 mt-2" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{step.step}</p>
                        {step.timestamp && (
                          <p className="text-sm text-slate-400">{new Date(step.timestamp).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Live Agent Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-700/30">
                        {getLogIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                log.level === "error"
                                  ? "text-red-400 border-red-400/30"
                                  : log.level === "warn"
                                    ? "text-yellow-400 border-yellow-400/30"
                                    : "text-blue-400 border-blue-400/30"
                              }`}
                            >
                              {log.level.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Agent Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-slate-400">Max Recursion Depth</Label>
                    <p className="text-2xl font-bold text-white">{agent.config.maxDepth}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Budget Limit</Label>
                    <p className="text-2xl font-bold text-white">${agent.config.budget}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Timeout (seconds)</Label>
                    <p className="text-2xl font-bold text-white">{agent.config.timeout}</p>
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
