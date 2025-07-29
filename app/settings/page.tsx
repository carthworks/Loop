"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { NavigationBar } from "@/components/navigation-bar"

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  type: "navigation" | "toggle" | "action"
  value?: boolean
  action?: () => void
}

export default function SettingsScreen() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [readReceipts, setReadReceipts] = useState(true)
  const [onlineStatus, setOnlineStatus] = useState(true)

  const userProfile = {
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    avatar: "/placeholder.svg?height=80&width=80&text=JD",
  }

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          id: "profile",
          title: "Profile",
          subtitle: "Update your personal information",
          icon: <User className="h-5 w-5" />,
          type: "navigation" as const,
          action: () => router.push("/settings/profile"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          subtitle: "Message and call alerts",
          icon: <Bell className="h-5 w-5" />,
          type: "toggle" as const,
          value: notifications,
          action: () => setNotifications(!notifications),
        },
        {
          id: "theme",
          title: "Dark Mode",
          subtitle: "Switch between light and dark theme",
          icon: theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
          type: "toggle" as const,
          value: theme === "dark",
          action: () => setTheme(theme === "dark" ? "light" : "dark"),
        },
        {
          id: "language",
          title: "Language",
          subtitle: "English (US)",
          icon: <Globe className="h-5 w-5" />,
          type: "navigation" as const,
          action: () => router.push("/settings/language"),
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          id: "privacy",
          title: "Privacy",
          subtitle: "Control your privacy settings",
          icon: <Shield className="h-5 w-5" />,
          type: "navigation" as const,
          action: () => router.push("/settings/privacy"),
        },
        {
          id: "read-receipts",
          title: "Read Receipts",
          subtitle: "Show when you've read messages",
          icon: <Smartphone className="h-5 w-5" />,
          type: "toggle" as const,
          value: readReceipts,
          action: () => setReadReceipts(!readReceipts),
        },
        {
          id: "online-status",
          title: "Online Status",
          subtitle: "Show when you're online",
          icon: <User className="h-5 w-5" />,
          type: "toggle" as const,
          value: onlineStatus,
          action: () => setOnlineStatus(!onlineStatus),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          title: "Help & Support",
          subtitle: "Get help and contact support",
          icon: <HelpCircle className="h-5 w-5" />,
          type: "navigation" as const,
          action: () => router.push("/settings/help"),
        },
      ],
    },
  ]

  const handleLogout = () => {
    // Handle logout logic
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                <AvatarFallback className="text-lg">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-background rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{userProfile.name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              <p className="text-sm text-muted-foreground">{userProfile.department}</p>
            </div>

            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="pb-20">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="py-4">
              <h4 className="text-sm font-medium text-muted-foreground px-4 mb-3">{section.title}</h4>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={item.action}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="text-muted-foreground">{item.icon}</div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium">{item.title}</h5>
                      {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                    </div>

                    {item.type === "toggle" ? (
                      <Switch checked={item.value} onCheckedChange={item.action} />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="py-4 border-t">
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Log Out</span>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar />
    </div>
  )
}
