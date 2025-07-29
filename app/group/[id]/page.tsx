"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageBubble } from "@/components/message-bubble"

interface GroupMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  isOwn: boolean
  status: "sent" | "delivered" | "read"
}

const mockGroupMessages: GroupMessage[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Mike Chen",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=MC",
    content: "Good morning team! Ready for sprint planning?",
    timestamp: "9:00 AM",
    type: "text",
    isOwn: false,
    status: "read",
  },
  {
    id: "2",
    senderId: "3",
    senderName: "Anna Rodriguez",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=AR",
    content: "Yes! I've prepared the user stories for review.",
    timestamp: "9:02 AM",
    type: "text",
    isOwn: false,
    status: "read",
  },
  {
    id: "3",
    senderId: "1",
    senderName: "You",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=You",
    content: "Perfect! I'll share the technical requirements doc.",
    timestamp: "9:05 AM",
    type: "text",
    isOwn: true,
    status: "read",
  },
  {
    id: "4",
    senderId: "4",
    senderName: "John Smith",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=JS",
    content: "The API endpoints are ready for integration testing.",
    timestamp: "9:10 AM",
    type: "text",
    isOwn: false,
    status: "read",
  },
  {
    id: "5",
    senderId: "2",
    senderName: "Mike Chen",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=MC",
    content: "Great work everyone! Meeting starts in 5 minutes.",
    timestamp: "2:55 PM",
    type: "text",
    isOwn: false,
    status: "delivered",
  },
]

const groupMembers = [
  { id: "1", name: "You", avatar: "/placeholder.svg?height=32&width=32&text=You", isOnline: true },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32&text=MC", isOnline: true },
  { id: "3", name: "Anna Rodriguez", avatar: "/placeholder.svg?height=32&width=32&text=AR", isOnline: true },
  { id: "4", name: "John Smith", avatar: "/placeholder.svg?height=32&width=32&text=JS", isOnline: false },
  { id: "5", name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32&text=LW", isOnline: true },
]

export default function GroupChatScreen() {
  const params = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<GroupMessage[]>(mockGroupMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const groupId = params.id as string
  const groupName = "Development Team"
  const onlineCount = groupMembers.filter((m) => m.isOnline).length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate typing indicators
  useEffect(() => {
    if (Math.random() > 0.8) {
      const typingUser = groupMembers[Math.floor(Math.random() * (groupMembers.length - 1)) + 1]
      setIsTyping([typingUser.name])
      const timeout = setTimeout(() => setIsTyping([]), 3000)
      return () => clearTimeout(timeout)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: GroupMessage = {
      id: Date.now().toString(),
      senderId: "1",
      senderName: "You",
      senderAvatar: "/placeholder.svg?height=32&width=32&text=You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isOwn: true,
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate group response
    setTimeout(() => {
      const responder = groupMembers[Math.floor(Math.random() * (groupMembers.length - 1)) + 1]
      const responses = [
        "Thanks for the update!",
        "Looks good to me 👍",
        "I agree with this approach",
        "Let me review and get back to you",
        "Great work!",
      ]

      const response: GroupMessage = {
        id: (Date.now() + 1).toString(),
        senderId: responder.id,
        senderName: responder.name,
        senderAvatar: responder.avatar,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        isOwn: false,
        status: "sent",
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=DT" alt={groupName} />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-medium truncate">{groupName}</h2>
            <p className="text-xs text-muted-foreground">
              {onlineCount} of {groupMembers.length} members online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Online Members */}
      <div className="flex gap-2 p-3 border-b bg-muted/30 overflow-x-auto">
        {groupMembers
          .filter((m) => m.isOnline)
          .map((member) => (
            <div key={member.id} className="flex flex-col items-center gap-1 min-w-0">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="text-xs">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-16">{member.name.split(" ")[0]}</span>
            </div>
          ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2 ${message.isOwn ? "justify-end" : "justify-start"}`}>
            {!message.isOwn && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
                <AvatarFallback className="text-xs">
                  {message.senderName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"} max-w-[80%]`}>
              {!message.isOwn && <span className="text-xs text-muted-foreground mb-1 px-1">{message.senderName}</span>}
              <MessageBubble message={message} showAvatar={false} />
            </div>
          </div>
        ))}

        {isTyping.length > 0 && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=T" alt="Typing" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{isTyping[0]} is typing</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="mb-1">
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Message Development Team..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 resize-none"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
