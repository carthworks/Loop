"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageBubble } from "@/components/message-bubble"
import { AuthGuard } from "@/components/auth-guard"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  isOwn: boolean
  status: "sent" | "delivered" | "read"
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Sarah Johnson",
    content: "Hey! How's the project coming along?",
    timestamp: "10:30 AM",
    type: "text",
    isOwn: false,
    status: "read",
  },
  {
    id: "2",
    senderId: "1",
    senderName: "You",
    content: "Going well! Just finished the user interface mockups.",
    timestamp: "10:32 AM",
    type: "text",
    isOwn: true,
    status: "read",
  },
  {
    id: "3",
    senderId: "2",
    senderName: "Sarah Johnson",
    content: "That's great! Can you share them in our team channel?",
    timestamp: "10:33 AM",
    type: "text",
    isOwn: false,
    status: "read",
  },
  {
    id: "4",
    senderId: "1",
    senderName: "You",
    content: "Sure thing! I'll upload them right after our call.",
    timestamp: "10:35 AM",
    type: "text",
    isOwn: true,
    status: "delivered",
  },
  {
    id: "5",
    senderId: "2",
    senderName: "Sarah Johnson",
    content: "Perfect. The quarterly report is ready for review too.",
    timestamp: "2 min ago",
    type: "text",
    isOwn: false,
    status: "sent",
  },
]

function ChatScreen() {
  const params = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatId = params.id as string
  const chatName = "Sarah Johnson"
  const isOnline = true

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (Math.random() > 0.7) {
      setIsTyping(true)
      const timeout = setTimeout(() => setIsTyping(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "1",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isOwn: true,
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "2",
        senderName: chatName,
        content: "Thanks for the update! 👍",
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
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=SJ" alt={chatName} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-medium truncate">{chatName}</h2>
            <p className="text-xs text-muted-foreground">{isOnline ? "Online" : "Last seen 2 hours ago"}</p>
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
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=SJ" alt={chatName} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
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
              placeholder="Type a message..."
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

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatScreen />
    </AuthGuard>
  )
}
