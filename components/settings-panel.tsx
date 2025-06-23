"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"

interface Role {
  id: string
  name: string
  description: string
  capabilities: string[]
  maxDepth: number
  budgetLimit: number
  active: boolean
}

interface Capability {
  id: string
  name: string
  description: string
  category: "analysis" | "generation" | "communication" | "coordination"
  enabled: boolean
}

interface Policy {
  id: string
  name: string
  description: string
  type: "spawn" | "budget" | "timeout" | "recursion"
  value: string | number
  enabled: boolean
}

const mockRoles: Role[] = [
  {
    id: "role-001",
    name: "Financial Analyst",
    description: "Specialized in financial data analysis and reporting",
    capabilities: ["data-analysis", "pattern-recognition", "report-generation"],
    maxDepth: 5,
    budgetLimit: 10.0,
    active: true,
  },
  {
    id: "role-002",
    name: "ML Specialist",
    description: "Machine learning and pattern recognition expert",
    capabilities: ["ml-processing", "pattern-recognition", "data-classification"],
    maxDepth: 3,
    budgetLimit: 15.0,
    active: true,
  },
]

const mockCapabilities: Capability[] = [
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Ability to analyze structured and unstructured data",
    category: "analysis",
    enabled: true,
  },
  {
    id: "pattern-recognition",
    name: "Pattern Recognition",
    description: "Identify patterns and anomalies in data",
    category: "analysis",
    enabled: true,
  },
  {
    id: "report-generation",
    name: "Report Generation",
    description: "Generate comprehensive reports and summaries",
    category: "generation",
    enabled: true,
  },
]

const mockPolicies: Policy[] = [
  {
    id: "policy-001",
    name: "Max Recursion Depth",
    description: "Maximum allowed recursion depth for any agent",
    type: "recursion",
    value: 10,
    enabled: true,
  },
  {
    id: "policy-002",
    name: "Default Budget Limit",
    description: "Default budget limit for new agents",
    type: "budget",
    value: 5.0,
    enabled: true,
  },
  {
    id: "policy-003",
    name: "Agent Timeout",
    description: "Maximum execution time for agents (seconds)",
    type: "timeout",
    value: 300,
    enabled: true,
  },
]

export function SettingsPanel() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [capabilities, setCapabilities] = useState<Capability[]>(mockCapabilities)
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    capabilities: [] as string[],
    maxDepth: 5,
    budgetLimit: 10.0,
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "analysis":
        return "bg-blue-500/10 text-blue-400"
      case "generation":
        return "bg-green-500/10 text-green-400"
      case "communication":
        return "bg-purple-500/10 text-purple-400"
      case "coordination":
        return "bg-yellow-500/10 text-yellow-400"
      default:
        return "bg-gray-500/10 text-gray-400"
    }
  }

  const handleAddRole = () => {
    const role: Role = {
      id: `role-${String(roles.length + 1).padStart(3, "0")}`,
      name: newRole.name,
      description: newRole.description,
      capabilities: newRole.capabilities,
      maxDepth: newRole.maxDepth,
      budgetLimit: newRole.budgetLimit,
      active: true,
    }
    setRoles([...roles, role])
    setNewRole({
      name: "",
      description: "",
      capabilities: [],
      maxDepth: 5,
      budgetLimit: 10.0,
    })
    setIsAddingRole(false)
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
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
              <p className="text-slate-400">Configure roles, capabilities, and policies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="roles">Role Definitions</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="system">System Config</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Agent Roles</h2>
              <Button onClick={() => setIsAddingRole(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </div>

            {isAddingRole && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Create New Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roleName" className="text-slate-300">
                        Role Name
                      </Label>
                      <Input
                        id="roleName"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Enter role name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxDepth" className="text-slate-300">
                        Max Depth
                      </Label>
                      <Input
                        id="maxDepth"
                        type="number"
                        value={newRole.maxDepth}
                        onChange={(e) => setNewRole({ ...newRole, maxDepth: Number.parseInt(e.target.value) })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roleDescription" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Describe the role's purpose"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetLimit" className="text-slate-300">
                      Budget Limit ($)
                    </Label>
                    <Input
                      id="budgetLimit"
                      type="number"
                      step="0.1"
                      value={newRole.budgetLimit}
                      onChange={(e) => setNewRole({ ...newRole, budgetLimit: Number.parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddRole} className="bg-green-600 hover:bg-green-700">
                      Create Role
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingRole(false)} className="border-slate-600">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                          <Badge
                            className={role.active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                          >
                            {role.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{role.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {role.capabilities.map((cap) => (
                            <Badge key={cap} variant="outline" className="text-blue-400 border-blue-400/30">
                              {cap}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <span>Max Depth: {role.maxDepth}</span>
                          <span>Budget: ${role.budgetLimit}</span>
                          <span>ID: {role.id}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-slate-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">System Capabilities</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Capability
              </Button>
            </div>

            <div className="grid gap-4">
              {capabilities.map((capability) => (
                <Card key={capability.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{capability.name}</h3>
                          <Badge className={getCategoryColor(capability.category)}>{capability.category}</Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{capability.description}</p>
                        <p className="text-sm text-slate-400">ID: {capability.id}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={capability.enabled}
                          onCheckedChange={(checked) => {
                            setCapabilities((prev) =>
                              prev.map((cap) => (cap.id === capability.id ? { ...cap, enabled: checked } : cap)),
                            )
                          }}
                        />
                        <Button variant="outline" size="sm" className="border-slate-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">System Policies</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Policy
              </Button>
            </div>

            <div className="grid gap-4">
              {policies.map((policy) => (
                <Card key={policy.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{policy.name}</h3>
                          <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                            {policy.type}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{policy.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <span>Value: {policy.value}</span>
                          <span>ID: {policy.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={(checked) => {
                            setPolicies((prev) =>
                              prev.map((pol) => (pol.id === policy.id ? { ...pol, enabled: checked } : pol)),
                            )
                          }}
                        />
                        <Button variant="outline" size="sm" className="border-slate-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">System Configuration</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">A2 Engine Connection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="baseUrl" className="text-slate-300">
                      Base URL
                    </Label>
                    <Input
                      id="baseUrl"
                      defaultValue="https://a2-core.example.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey" className="text-slate-300">
                      API Key
                    </Label>
                    <Input
                      id="apiKey"
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Test Connection</Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Performance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="refreshRate" className="text-slate-300">
                      Refresh Rate (seconds)
                    </Label>
                    <Select defaultValue="5">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="1">1 second</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="realtime" className="text-slate-300">
                      Real-time Updates
                    </Label>
                    <Switch id="realtime" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-slate-300">
                      Push Notifications
                    </Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
