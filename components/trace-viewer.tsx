"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Activity, Play, Pause, RotateCcw } from "lucide-react"
import Link from "next/link"

interface TraceNode {
  id: string
  name: string
  type: "mission" | "subgoal" | "agent"
  status: "active" | "completed" | "failed" | "pending"
  depth: number
  x: number
  y: number
  connections: string[]
  metadata: {
    role?: string
    progress?: number
    cost?: number
  }
}

interface TraceEdge {
  source: string
  target: string
  type: "spawn" | "delegate" | "report"
}

const mockNodes: TraceNode[] = [
  {
    id: "MG-001",
    name: "Fiscal Analysis Q4",
    type: "mission",
    status: "active",
    depth: 0,
    x: 400,
    y: 100,
    connections: ["SG-001", "SG-002", "SG-003"],
    metadata: { progress: 67 },
  },
  {
    id: "SG-001",
    name: "Revenue Analysis",
    type: "subgoal",
    status: "completed",
    depth: 1,
    x: 200,
    y: 250,
    connections: ["AGT-001", "AGT-002"],
    metadata: { progress: 100, cost: 0.45 },
  },
  {
    id: "SG-002",
    name: "Expense Categorization",
    type: "subgoal",
    status: "active",
    depth: 1,
    x: 400,
    y: 250,
    connections: ["AGT-003", "SG-004"],
    metadata: { progress: 78, cost: 0.32 },
  },
  {
    id: "SG-003",
    name: "Forecast Generation",
    type: "subgoal",
    status: "pending",
    depth: 1,
    x: 600,
    y: 250,
    connections: [],
    metadata: { progress: 0, cost: 0 },
  },
  {
    id: "AGT-001",
    name: "Financial Analyzer Alpha",
    type: "agent",
    status: "completed",
    depth: 2,
    x: 100,
    y: 400,
    connections: [],
    metadata: { role: "Data Analysis" },
  },
  {
    id: "AGT-002",
    name: "Pattern Recognition Beta",
    type: "agent",
    status: "completed",
    depth: 2,
    x: 300,
    y: 400,
    connections: [],
    metadata: { role: "ML Specialist" },
  },
  {
    id: "AGT-003",
    name: "Expense Classifier Gamma",
    type: "agent",
    status: "active",
    depth: 2,
    x: 400,
    y: 400,
    connections: [],
    metadata: { role: "Classification" },
  },
  {
    id: "SG-004",
    name: "Anomaly Detection",
    type: "subgoal",
    status: "active",
    depth: 2,
    x: 500,
    y: 400,
    connections: ["AGT-004"],
    metadata: { progress: 34, cost: 0.18 },
  },
  {
    id: "AGT-004",
    name: "Anomaly Hunter Delta",
    type: "agent",
    status: "active",
    depth: 3,
    x: 500,
    y: 550,
    connections: [],
    metadata: { role: "Anomaly Detection" },
  },
]

export function TraceViewer() {
  const [nodes, setNodes] = useState<TraceNode[]>(mockNodes)
  const [selectedNode, setSelectedNode] = useState<TraceNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const svgRef = useRef<SVGSVGElement>(null)

  // Simulate real-time updates
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.status === "active" && node.metadata.progress !== undefined) {
            return {
              ...node,
              metadata: {
                ...node.metadata,
                progress: Math.min(100, (node.metadata.progress || 0) + Math.random() * 5),
              },
            }
          }
          return node
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const getNodeColor = (node: TraceNode) => {
    switch (node.status) {
      case "active":
        return node.type === "mission" ? "#3B82F6" : node.type === "subgoal" ? "#10B981" : "#8B5CF6"
      case "completed":
        return "#22C55E"
      case "failed":
        return "#EF4444"
      case "pending":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const getNodeIcon = (node: TraceNode) => {
    switch (node.type) {
      case "mission":
        return "🎯"
      case "subgoal":
        return "🔗"
      case "agent":
        return "🤖"
    }
  }

  const filteredNodes = nodes.filter((node) => {
    if (filter === "all") return true
    return node.type === filter
  })

  const getConnections = () => {
    const connections: TraceEdge[] = []
    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        connections.push({
          source: node.id,
          target: targetId,
          type: "spawn",
        })
      })
    })
    return connections
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
                <h1 className="text-2xl font-bold text-white">Trace Viewer</h1>
                <p className="text-slate-400">Real-time execution graph</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Nodes</SelectItem>
                  <SelectItem value="mission">Missions</SelectItem>
                  <SelectItem value="subgoal">Subgoals</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="border-slate-600">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button variant="outline" size="sm" className="border-slate-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700/50 h-[600px]">
              <CardContent className="p-0 h-full">
                <svg
                  ref={svgRef}
                  className="w-full h-full"
                  viewBox="0 0 800 600"
                  style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
                >
                  {/* Grid Pattern */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Connections */}
                  {getConnections().map((edge, index) => {
                    const sourceNode = nodes.find((n) => n.id === edge.source)
                    const targetNode = nodes.find((n) => n.id === edge.target)
                    if (!sourceNode || !targetNode) return null

                    return (
                      <line
                        key={index}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="#475569"
                        strokeWidth="2"
                        opacity="0.6"
                        markerEnd="url(#arrowhead)"
                      />
                    )
                  })}

                  {/* Arrow marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                    </marker>
                  </defs>

                  {/* Nodes */}
                  {filteredNodes.map((node) => (
                    <g key={node.id}>
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.type === "mission" ? 25 : node.type === "subgoal" ? 20 : 15}
                        fill={getNodeColor(node)}
                        stroke={selectedNode?.id === node.id ? "#F59E0B" : "transparent"}
                        strokeWidth="3"
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedNode(node)}
                      />

                      {/* Pulse animation for active nodes */}
                      {node.status === "active" && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.type === "mission" ? 25 : node.type === "subgoal" ? 20 : 15}
                          fill="none"
                          stroke={getNodeColor(node)}
                          strokeWidth="2"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values={`${node.type === "mission" ? 25 : node.type === "subgoal" ? 20 : 15};${node.type === "mission" ? 35 : node.type === "subgoal" ? 30 : 25};${node.type === "mission" ? 25 : node.type === "subgoal" ? 20 : 15}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Node label */}
                      <text
                        x={node.x}
                        y={node.y - (node.type === "mission" ? 35 : node.type === "subgoal" ? 30 : 25)}
                        textAnchor="middle"
                        className="fill-white text-xs font-medium"
                      >
                        {node.id}
                      </text>

                      {/* Progress indicator for active nodes */}
                      {node.status === "active" && node.metadata.progress !== undefined && (
                        <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white text-xs">
                          {Math.round(node.metadata.progress)}%
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* Node Details Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Node Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedNode.name}</h3>
                      <p className="text-slate-400 text-sm">ID: {selectedNode.id}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                        {selectedNode.type}
                      </Badge>
                      <Badge
                        className={`${
                          selectedNode.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : selectedNode.status === "completed"
                              ? "bg-blue-500/10 text-blue-500"
                              : selectedNode.status === "failed"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {selectedNode.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Depth</span>
                        <span className="text-white">{selectedNode.depth}</span>
                      </div>
                      {selectedNode.metadata.progress !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{Math.round(selectedNode.metadata.progress)}%</span>
                        </div>
                      )}
                      {selectedNode.metadata.cost !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cost</span>
                          <span className="text-white">${selectedNode.metadata.cost}</span>
                        </div>
                      )}
                      {selectedNode.metadata.role && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Role</span>
                          <span className="text-white">{selectedNode.metadata.role}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm mb-2">Connections</p>
                      <div className="space-y-1">
                        {selectedNode.connections.map((connId) => (
                          <div key={connId} className="text-xs text-slate-300 bg-slate-700/30 px-2 py-1 rounded">
                            → {connId}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">Click on a node to view details</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Mission</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Subgoal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Agent</span>
                  </div>
                  <hr className="border-slate-600" />
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">Active (pulsing)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Failed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
