"use client"

import { useState } from "react"
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"
import { ThemeToggle } from "@/components/theme-toggle"

interface CallRecord {
  id: string
  name: string
  avatar: string
  type: "incoming" | "outgoing" | "missed"
  callType: "voice" | "video"
  timestamp: string
  duration?: string
  isGroup: boolean
  participants?: string[]
}

const mockCallHistory: CallRecord[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    type: "outgoing",
    callType: "video",
    timestamp: "10 min ago",
    duration: "15:32",
    isGroup: false,
  },
  {
    id: "2",
    name: "Development Team",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    type: "incoming",
    callType: "voice",
    timestamp: "1 hour ago",
    duration: "45:12",
    isGroup: true,
    participants: ["Mike", "Anna", "John", "+2"],
  },
  {
    id: "3",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    type: "missed",
    callType: "voice",
    timestamp: "2 hours ago",
    isGroup: false,
  },
  {
    id: "4",
    name: "Marketing Team",
    avatar: "/placeholder.svg?height=40&width=40&text=MT",
    type: "outgoing",
    callType: "video",
    timestamp: "Yesterday",
    duration: "28:45",
    isGroup: true,
    participants: ["Lisa", "Tom", "Emma"],
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    type: "incoming",
    callType: "voice",
    timestamp: "2 days ago",
    duration: "12:18",
    isGroup: false,
  },
]

export default function CallsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredCalls = mockCallHistory.filter((call) => call.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCallIcon = (type: string, callType: string) => {
    const iconClass = "h-4 w-4"

    if (type === "missed") {
      return <PhoneMissed className={`${iconClass} text-red-500`} />
    } else if (type === "incoming") {
      return callType === "video" ? (
        <Video className={`${iconClass} text-green-500`} />
      ) : (
        <PhoneIncoming className={`${iconClass} text-green-500`} />
      )
    } else {
      return callType === "video" ? (
        <Video className={`${iconClass} text-blue-500`} />
      ) : (
        <PhoneOutgoing className={`${iconClass} text-blue-500`} />
      )
    }
  }

  const handleCallClick = (call: CallRecord) => {
    if (call.isGroup) {
      router.push("/call/group")
    } else {
      router.push(`/call/${call.id}`)
    }
  }

  const filterCallsByType = (type: string) => {
    if (type === "all") return filteredCalls
    return filteredCalls.filter((call) => call.type === type)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Calls</h1>
          <Badge variant="secondary" className="text-xs">
            {mockCallHistory.filter((call) => call.type === "missed").length} missed
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Call History */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto mt-0 pb-20">
            <div className="space-y-1">
              {filterCallsByType("all").map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.avatar || "/placeholder.svg"} alt={call.name} />
                    <AvatarFallback>
                      {call.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getCallIcon(call.type, call.callType)}
                      <h3 className="font-medium truncate">{call.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{call.timestamp}</span>
                      {call.duration && (
                        <>
                          <span>•</span>
                          <span>{call.duration}</span>
                        </>
                      )}
                    </div>
                    {call.isGroup && call.participants && (
                      <p className="text-xs text-muted-foreground mt-1">{call.participants.join(", ")}</p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCallClick(call)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCallClick(call)}>
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {["missed", "incoming", "outgoing"].map((type) => (
            <TabsContent key={type} value={type} className="flex-1 overflow-y-auto mt-0 pb-20">
              <div className="space-y-1">
                {filterCallsByType(type).map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={call.avatar || "/placeholder.svg"} alt={call.name} />
                      <AvatarFallback>
                        {call.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getCallIcon(call.type, call.callType)}
                        <h3 className="font-medium truncate">{call.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{call.timestamp}</span>
                        {call.duration && (
                          <>
                            <span>•</span>
                            <span>{call.duration}</span>
                          </>
                        )}
                      </div>
                      {call.isGroup && call.participants && (
                        <p className="text-xs text-muted-foreground mt-1">{call.participants.join(", ")}</p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCallClick(call)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCallClick(call)}>
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <NavigationBar />
    </div>
  )
}
