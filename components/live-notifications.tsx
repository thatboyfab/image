"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Bell, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-context"

interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { subscribe } = useWebSocket()

  useEffect(() => {
    const unsubscribeAlert = subscribe("system_alert", (data) => {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: data.severity === "high" ? "error" : data.severity === "medium" ? "warning" : "info",
        title: "System Alert",
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
      }
      setNotifications((prev) => [notification, ...prev.slice(0, 9)])
    })

    const unsubscribeMission = subscribe("mission_update", (data) => {
      if (data.status === "completed") {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          type: "success",
          title: "Mission Completed",
          message: `Mission ${data.missionId} has been completed successfully`,
          timestamp: new Date().toISOString(),
          read: false,
        }
        setNotifications((prev) => [notification, ...prev.slice(0, 9)])
      }
    })

    const unsubscribeAgent = subscribe("agent_status", (data) => {
      if (data.status === "error") {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          type: "error",
          title: "Agent Error",
          message: `Agent ${data.agentId} encountered an error`,
          timestamp: new Date().toISOString(),
          read: false,
        }
        setNotifications((prev) => [notification, ...prev.slice(0, 9)])
      }
    })

    return () => {
      unsubscribeAlert()
      unsubscribeMission()
      unsubscribeAgent()
    }
  }, [subscribe])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-400 hover:text-white"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 border-slate-700/50 backdrop-blur-sm z-50">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-white font-medium">Live Notifications</h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-slate-400">
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 cursor-pointer ${
                      !notification.read ? "bg-slate-700/20" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{notification.title}</p>
                        <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
