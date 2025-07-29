"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreVertical, Phone, Video, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavigationBar } from "@/components/navigation-bar"
import { AuthGuard } from "@/components/auth-guard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isGroup: boolean
  isOnline: boolean
  participants?: string[]
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    lastMessage: "The quarterly report is ready for review",
    timestamp: "2 min ago",
    unreadCount: 2,
    isGroup: false,
    isOnline: true,
  },
  {
    id: "2",
    name: "Development Team",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    lastMessage: "Mike: Sprint planning meeting at 3 PM",
    timestamp: "5 min ago",
    unreadCount: 5,
    isGroup: true,
    isOnline: false,
    participants: ["Mike", "Anna", "John", "+3"],
  },
  {
    id: "3",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    lastMessage: "Thanks for the quick turnaround!",
    timestamp: "1 hour ago",
    unreadCount: 0,
    isGroup: false,
    isOnline: true,
  },
  {
    id: "4",
    name: "Marketing Team",
    avatar: "/placeholder.svg?height=40&width=40&text=MT",
    lastMessage: "Lisa: Campaign metrics look great",
    timestamp: "2 hours ago",
    unreadCount: 1,
    isGroup: true,
    isOnline: false,
    participants: ["Lisa", "Tom", "Emma", "+2"],
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    lastMessage: "Let's schedule a call tomorrow",
    timestamp: "Yesterday",
    unreadCount: 0,
    isGroup: false,
    isOnline: false,
  },
  {
    id: "6",
    name: "HR Team",
    avatar: "/placeholder.svg?height=40&width=40&text=HR",
    lastMessage: "Welcome to the team! Please check your onboarding tasks",
    timestamp: "Yesterday",
    unreadCount: 3,
    isGroup: true,
    isOnline: false,
    participants: ["Jennifer", "Mark", "Lisa", "+1"],
  },
  {
    id: "7",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
    lastMessage: "The client presentation went well!",
    timestamp: "2 days ago",
    unreadCount: 0,
    isGroup: false,
    isOnline: true,
  },
]

function DashboardContent() {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const userData = localStorage.getItem('user')
    
    if (!isAuthenticated || !userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
  }, [router])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (Math.random() > 0.95) {
            return {
              ...chat,
              unreadCount: chat.unreadCount + 1,
              timestamp: "now",
            }
          }
          return chat
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Chats</h1>
          <Badge variant="secondary" className="text-xs">
            {chats.reduce((acc, chat) => acc + chat.unreadCount, 0)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="px-4 py-2 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.department} • {user.role}</div>
          </div>
          <div className="ml-auto">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 p-4 border-b">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Users className="h-4 w-4 mr-2" />
          New Group
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                <AvatarFallback>
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {chat.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
              )}
              {chat.isGroup && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              {chat.isGroup && chat.participants && (
                <p className="text-xs text-muted-foreground mt-1">{chat.participants.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {chat.unreadCount > 0 && (
                <Badge variant="default" className="h-5 min-w-5 text-xs">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </Badge>
              )}
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NavigationBar />
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
