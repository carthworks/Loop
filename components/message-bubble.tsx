import { Check, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  isOwn: boolean
  status: "sent" | "delivered" | "read"
  senderAvatar?: string
}

interface MessageBubbleProps {
  message: Message
  showAvatar?: boolean
}

export function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
        return <CheckCheck className="h-3 w-3" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`flex gap-2 ${message.isOwn ? "justify-end" : "justify-start"}`}>
      {!message.isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage
            src={
              message.senderAvatar ||
              `/placeholder.svg?height=32&width=32&text=${message.senderName
                .split(" ")
                .map((n) => n[0])
                .join("")}`
            }
            alt={message.senderName}
          />
          <AvatarFallback className="text-xs">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${!message.isOwn && showAvatar ? "" : "ml-10"}`}>
        <div className={`rounded-2xl px-4 py-2 ${message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div className={`flex items-center gap-1 mt-1 px-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          {message.isOwn && <div className="text-muted-foreground">{getStatusIcon()}</div>}
        </div>
      </div>
    </div>
  )
}
