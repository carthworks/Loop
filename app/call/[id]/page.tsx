"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Users,
  MessageSquare,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function CallScreen() {
  const params = useParams()
  const router = useRouter()
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting")

  const callId = params.id as string
  const isGroupCall = callId === "group"
  const callerName = isGroupCall ? "Development Team" : "Sarah Johnson"
  const callerAvatar = isGroupCall
    ? "/placeholder.svg?height=120&width=120&text=DT"
    : "/placeholder.svg?height=120&width=120&text=SJ"

  // Group call participants
  const participants = [
    {
      id: "1",
      name: "You",
      avatar: "/placeholder.svg?height=80&width=80&text=You",
      isMuted: isMuted,
      isVideoOn: isVideoOn,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=80&width=80&text=MC",
      isMuted: false,
      isVideoOn: true,
    },
    {
      id: "3",
      name: "Anna Rodriguez",
      avatar: "/placeholder.svg?height=80&width=80&text=AR",
      isMuted: true,
      isVideoOn: false,
    },
    {
      id: "4",
      name: "John Smith",
      avatar: "/placeholder.svg?height=80&width=80&text=JS",
      isMuted: false,
      isVideoOn: true,
    },
  ]

  useEffect(() => {
    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus("connected")
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    router.back()
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn)

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            {callStatus === "connecting" ? "Connecting..." : callStatus === "connected" ? "Connected" : "Ended"}
          </Badge>
          {callStatus === "connected" && <span className="text-sm text-white/70">{formatDuration(callDuration)}</span>}
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {isGroupCall ? (
          /* Group Call Layout */
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">{callerName}</h2>
              <p className="text-white/70">{participants.length} participants</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {participants.map((participant) => (
                <div key={participant.id} className="relative">
                  <div className="aspect-square bg-black/30 rounded-2xl overflow-hidden border border-white/20">
                    {participant.isVideoOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded">{participant.name}</span>
                    {participant.isMuted && (
                      <div className="bg-red-500 p-1 rounded-full">
                        <MicOff className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Individual Call Layout */
          <div className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-white/20">
              <AvatarImage src={callerAvatar || "/placeholder.svg"} alt={callerName} />
              <AvatarFallback className="text-4xl">
                {callerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-3xl font-semibold mb-2">{callerName}</h2>
            <p className="text-white/70 text-lg">{callStatus === "connecting" ? "Connecting..." : "On call"}</p>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Secondary Controls */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={toggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          {isGroupCall && (
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Users className="h-6 w-6" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* Mute Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-16 w-16 rounded-full border-2 ${
              isMuted ? "bg-red-500 hover:bg-red-600 border-red-400" : "bg-white/10 hover:bg-white/20 border-white/20"
            } text-white`}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>

          {/* End Call Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 text-white border-2 border-red-400"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-8 w-8" />
          </Button>

          {/* Video Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-16 w-16 rounded-full border-2 ${
              !isVideoOn
                ? "bg-red-500 hover:bg-red-600 border-red-400"
                : "bg-white/10 hover:bg-white/20 border-white/20"
            } text-white`}
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
