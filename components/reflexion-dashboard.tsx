"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, AlertTriangle, TrendingUp, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Anomaly {
  id: string
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
  type: "performance" | "logic" | "resource" | "pattern"
  description: string
  affectedNodes: string[]
  status: "detected" | "investigating" | "resolved"
  confidence: number
}

interface KPGUpdate {
  id: string
  timestamp: string
  type: "schema_promotion" | "schema_drop" | "pattern_learned" | "capability_enhanced"
  description: string
  impact: "low" | "medium" | "high"
  details: {
    before?: string
    after?: string
    confidence?: number
  }
}

interface ReplanEvent {
  id: string
  timestamp: string
  initiatingAgent: string
  reason: string
  scope: "local" | "branch" | "global"
  status: "initiated" | "in_progress" | "completed" | "failed"
  affectedSubgoals: string[]
}

const mockAnomalies: Anomaly[] = [
  {
    id: "ANO-001",
    timestamp: "2024-01-15T11:23:45Z",
    severity: "medium",
    type: "performance",
    description: "Agent AGT-003 showing 40% higher latency than baseline",
    affectedNodes: ["AGT-003", "SG-002"],
    status: "investigating",
    confidence: 87.3,
  },
  {
    id: "ANO-002",
    timestamp: "2024-01-15T10:45:12Z",
    severity: "low",
    type: "pattern",
    description: "Unusual data pattern detected in expense categorization",
    affectedNodes: ["SG-002"],
    status: "resolved",
    confidence: 92.1,
  },
]

const mockKPGUpdates: KPGUpdate[] = [
  {
    id: "KPG-001",
    timestamp: "2024-01-15T11:30:00Z",
    type: "pattern_learned",
    description: "New financial analysis pattern identified and integrated",
    impact: "medium",
    details: {
      confidence: 94.2,
    },
  },
  {
    id: "KPG-002",
    timestamp: "2024-01-15T10:15:00Z",
    type: "schema_promotion",
    description: "Expense categorization schema promoted to global knowledge",
    impact: "high",
    details: {
      before: "Local schema v1.2",
      after: "Global schema v2.0",
    },
  },
]

const mockReplans: ReplanEvent[] = [
  {
    id: "RPL-001",
    timestamp: "2024-01-15T11:45:00Z",
    initiatingAgent: "AGT-003",
    reason: "Performance degradation detected, requesting resource reallocation",
    scope: "branch",
    status: "completed",
    affectedSubgoals: ["SG-002", "SG-004"],
  },
]

export function ReflexionDashboard() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalies)
  const [kpgUpdates, setKPGUpdates] = useState<KPGUpdate[]>(mockKPGUpdates)
  const [replans, setReplans] = useState<ReplanEvent[]>(mockReplans)
  const [systemHealth, setSystemHealth] = useState(94.2)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate system health fluctuation
      setSystemHealth((prev) => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2)))

      // Occasionally add new anomalies
      if (Math.random() < 0.1) {
        const newAnomaly: Anomaly = {
          id: `ANO-${String(anomalies.length + 1).padStart(3, "0")}`,
          timestamp: new Date().toISOString(),
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          type: ["performance", "logic", "resource", "pattern"][Math.floor(Math.random() * 4)] as any,
          description: "Automated anomaly detection triggered",
          affectedNodes: [`AGT-${String(Math.floor(Math.random() * 10) + 1).padStart(3, "0")}`],
          status: "detected",
          confidence: Math.random() * 30 + 70,
        }
        setAnomalies((prev) => [newAnomaly, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [anomalies.length])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/10 text-red-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "low":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-gray-500/10 text-gray-500"
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
                <h1 className="text-2xl font-bold text-white">Reflexion Dashboard</h1>
                <p className="text-slate-400">System intelligence and adaptation monitoring</p>
              </div>
            </div>

            <Button variant="outline" className="border-slate-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-white">{systemHealth.toFixed(1)}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <Progress value={systemHealth} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Anomalies</p>
                  <p className="text-2xl font-bold text-white">
                    {anomalies.filter((a) => a.status !== "resolved").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">KPG Updates</p>
                  <p className="text-2xl font-bold text-white">{kpgUpdates.length}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Replans Today</p>
                  <p className="text-2xl font-bold text-white">{replans.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="anomalies" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="kpg">Knowledge Updates</TabsTrigger>
            <TabsTrigger value="replans">Replan Events</TabsTrigger>
          </TabsList>

          <TabsContent value="anomalies" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Anomaly Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-24 gap-1 mb-4">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div
                      key={hour}
                      className={`h-8 rounded ${
                        Math.random() > 0.7
                          ? "bg-red-500/30"
                          : Math.random() > 0.5
                            ? "bg-yellow-500/30"
                            : "bg-green-500/30"
                      }`}
                      title={`${hour}:00 - ${hour + 1}:00`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:59</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <Card key={anomaly.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{anomaly.id}</h3>
                          <Badge className={`${getSeverityColor(anomaly.severity)} border`}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-slate-400">
                            {anomaly.type}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{anomaly.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <span>Confidence: {anomaly.confidence.toFixed(1)}%</span>
                          <span>Affected: {anomaly.affectedNodes.join(", ")}</span>
                          <span>{new Date(anomaly.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      <Badge
                        className={`${
                          anomaly.status === "resolved"
                            ? "bg-green-500/10 text-green-500"
                            : anomaly.status === "investigating"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {anomaly.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kpg" className="space-y-4">
            <div className="space-y-4">
              {kpgUpdates.map((update) => (
                <Card key={update.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{update.id}</h3>
                          <Badge className={getImpactColor(update.impact)}>{update.impact.toUpperCase()} IMPACT</Badge>
                          <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                            {update.type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{update.description}</p>

                        {update.details && (
                          <div className="space-y-2 text-sm">
                            {update.details.before && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Before:</span>
                                <span className="text-slate-300">{update.details.before}</span>
                              </div>
                            )}
                            {update.details.after && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">After:</span>
                                <span className="text-slate-300">{update.details.after}</span>
                              </div>
                            )}
                            {update.details.confidence && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Confidence:</span>
                                <span className="text-slate-300">{update.details.confidence}%</span>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-slate-400 mt-3">{new Date(update.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="replans" className="space-y-4">
            <div className="space-y-4">
              {replans.map((replan) => (
                <Card key={replan.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{replan.id}</h3>
                          <Badge
                            className={`${
                              replan.scope === "global"
                                ? "bg-red-500/10 text-red-500"
                                : replan.scope === "branch"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {replan.scope.toUpperCase()}
                          </Badge>
                          <Badge
                            className={`${
                              replan.status === "completed"
                                ? "bg-green-500/10 text-green-500"
                                : replan.status === "in_progress"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : replan.status === "failed"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {replan.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{replan.reason}</p>

                        <div className="flex items-center space-x-6 text-sm text-slate-400 mb-2">
                          <span>Initiated by: {replan.initiatingAgent}</span>
                          <span>{new Date(replan.timestamp).toLocaleString()}</span>
                        </div>

                        <div className="text-sm text-slate-400">
                          <span>Affected subgoals: {replan.affectedSubgoals.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
