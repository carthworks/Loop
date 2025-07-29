"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft, Clock, Users, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"

interface SearchResult {
  id: string
  type: "message" | "contact" | "file" | "group"
  title: string
  subtitle: string
  avatar?: string
  timestamp?: string
  chatId?: string
  preview?: string
  fileType?: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "message",
    title: "Sarah Johnson",
    subtitle: "The quarterly report is ready for review",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    timestamp: "2 min ago",
    chatId: "1",
    preview: "Hey! The quarterly report is ready for review. Can you take a look?",
  },
  {
    id: "2",
    type: "contact",
    title: "Alex Chen",
    subtitle: "Senior Developer",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    chatId: "3",
  },
  {
    id: "3",
    type: "group",
    title: "Marketing Team",
    subtitle: "5 members",
    avatar: "/placeholder.svg?height=40&width=40&text=MT",
    chatId: "group-2",
  },
  {
    id: "4",
    type: "message",
    title: "Development Team",
    subtitle: "Mike: Sprint planning meeting at 3 PM",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    timestamp: "1 hour ago",
    chatId: "group-1",
    preview: "Sprint planning meeting at 3 PM today. Please prepare your user stories.",
  },
  {
    id: "5",
    type: "file",
    title: "Project_Requirements.pdf",
    subtitle: "Shared by Mike Chen",
    timestamp: "Yesterday",
    fileType: "pdf",
    chatId: "group-1",
  },
  {
    id: "6",
    type: "message",
    title: "David Wilson",
    subtitle: "Let's schedule a call tomorrow",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    timestamp: "2 days ago",
    chatId: "5",
    preview: "Let's schedule a call tomorrow to discuss the new feature requirements.",
  },
]

const recentSearches = ["quarterly report", "sprint planning", "Alex Chen", "project requirements", "marketing team"]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(
          (result) =>
            result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.preview?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "contact" || result.type === "message") {
      if (result.chatId?.startsWith("group")) {
        router.push(`/group/${result.chatId.split("-")[1]}`)
      } else {
        router.push(`/chat/${result.chatId}`)
      }
    } else if (result.type === "group") {
      router.push(`/group/${result.chatId?.split("-")[1]}`)
    }
  }

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query)
  }

  const getResultIcon = (type: string, fileType?: string) => {
    switch (type) {
      case "group":
        return <Users className="h-4 w-4" />
      case "file":
        return fileType === "pdf" ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const filterResultsByType = (type: string) => {
    return searchResults.filter((result) => result.type === type)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages, contacts, files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {!searchQuery.trim() ? (
          /* Recent Searches */
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((query, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{query}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="flex-1">
            {isSearching ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="contacts">People</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="flex-1 overflow-y-auto mt-0">
                  <div className="p-4 space-y-1">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                      >
                        {result.avatar ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.title} />
                            <AvatarFallback>
                              {result.title
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            {getResultIcon(result.type, result.fileType)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            {result.timestamp && (
                              <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{result.preview || result.subtitle}</p>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="messages" className="flex-1 overflow-y-auto mt-0">
                  <div className="p-4 space-y-1">
                    {filterResultsByType("message").map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.title} />
                          <AvatarFallback>
                            {result.title
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{result.preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="flex-1 overflow-y-auto mt-0">
                  <div className="p-4 space-y-1">
                    {filterResultsByType("contact")
                      .concat(filterResultsByType("group"))
                      .map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.title} />
                            <AvatarFallback>
                              {result.title
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                          </div>
                          {result.type === "group" && <Users className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="files" className="flex-1 overflow-y-auto mt-0">
                  <div className="p-4 space-y-1">
                    {filterResultsByType("file").map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                          {getResultIcon(result.type, result.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-1">No results found</h3>
                  <p className="text-sm text-muted-foreground">Try searching for something else</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}
