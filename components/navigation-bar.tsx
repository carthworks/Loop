"use client"

import { usePathname, useRouter } from "next/navigation"
import { MessageCircle, Search, Phone, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NavigationBar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      icon: MessageCircle,
      label: "Chats",
      path: "/",
      badge: 7,
    },
    {
      icon: Search,
      label: "Search",
      path: "/search",
    },
    {
      icon: Phone,
      label: "Calls",
      path: "/calls",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
