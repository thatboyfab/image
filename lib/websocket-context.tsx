"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

interface WebSocketMessage {
  type: "mission_update" | "agent_status" | "subgoal_progress" | "system_alert" | "trace_event"
  payload: any
  timestamp: string
}

interface WebSocketContextType {
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  subscribe: (type: string, callback: (data: any) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return

    setConnectionStatus("connecting")

    // Simulate WebSocket connection for demo
    const mockConnect = () => {
      setIsConnected(true)
      setConnectionStatus("connected")
      console.log("A2 Control WebSocket connected (simulated)")
    }

    // Simulate connection after a short delay
    setTimeout(mockConnect, 1000)
  }, [socket])

  const sendMessage = useCallback(
    (message: any) => {
      if (isConnected) {
        console.log("Sending message:", message)
      }
    },
    [isConnected],
  )

  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    const subscribers = subscribersRef.current
    if (!subscribers.has(type)) {
      subscribers.set(type, new Set())
    }
    subscribers.get(type)!.add(callback)

    // Return unsubscribe function
    return () => {
      const typeSubscribers = subscribers.get(type)
      if (typeSubscribers) {
        typeSubscribers.delete(callback)
        if (typeSubscribers.size === 0) {
          subscribers.delete(type)
        }
      }
    }
  }, [])

  // Initial connection
  useEffect(() => {
    connect()
  }, [])

  // Simulate real-time data for demo purposes
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(
      () => {
        // Simulate various types of real-time updates
        const messageTypes = ["mission_update", "agent_status", "subgoal_progress", "system_alert", "trace_event"]
        const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)]

        let payload
        switch (randomType) {
          case "mission_update":
            payload = {
              missionId: `MG-${String(Math.floor(Math.random() * 3) + 1).padStart(3, "0")}`,
              progress: Math.floor(Math.random() * 100),
              status: ["active", "completed", "failed"][Math.floor(Math.random() * 3)],
            }
            break
          case "agent_status":
            payload = {
              agentId: `AGT-${String(Math.floor(Math.random() * 10) + 1).padStart(3, "0")}`,
              status: ["active", "idle", "error"][Math.floor(Math.random() * 3)],
              performance: {
                latency: Math.random() * 5,
                successRate: 85 + Math.random() * 15,
              },
            }
            break
          case "subgoal_progress":
            payload = {
              subgoalId: `SG-${String(Math.floor(Math.random() * 10) + 1).padStart(3, "0")}`,
              progress: Math.floor(Math.random() * 100),
              agentsAssigned: Math.floor(Math.random() * 5) + 1,
            }
            break
          case "system_alert":
            payload = {
              severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
              message: "System performance anomaly detected",
              component: "A2-Engine-Core",
            }
            break
          case "trace_event":
            payload = {
              nodeId: `NODE-${Math.floor(Math.random() * 100)}`,
              event: "spawn",
              parentId: `NODE-${Math.floor(Math.random() * 50)}`,
            }
            break
        }

        const message: WebSocketMessage = {
          type: randomType as any,
          payload,
          timestamp: new Date().toISOString(),
        }

        setLastMessage(message)

        // Notify subscribers
        const typeSubscribers = subscribersRef.current.get(message.type)
        if (typeSubscribers) {
          typeSubscribers.forEach((callback) => callback(message.payload))
        }
      },
      3000 + Math.random() * 2000,
    ) // Random interval between 3-5 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionStatus,
        lastMessage,
        sendMessage,
        subscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
