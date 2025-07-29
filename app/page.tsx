"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Phone, Video, Shield, Zap, Globe } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Sample company data
const companyStats = {
  totalEmployees: 1247,
  activeChats: 89,
  onlineUsers: 342,
  departments: 12
}

const features = [
  {
    icon: MessageCircle,
    title: "Instant Messaging",
    description: "Real-time chat with colleagues across all departments"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Create groups and channels for project-based communication"
  },
  {
    icon: Phone,
    title: "Voice Calls",
    description: "High-quality voice calls with crystal clear audio"
  },
  {
    icon: Video,
    title: "Video Conferencing",
    description: "Face-to-face meetings with screen sharing capabilities"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption and enterprise-grade security"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with real-time message delivery"
  }
]

export default function WelcomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to <span className="text-blue-600">CompanyChat</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect, collaborate, and communicate with your team like never before.
                Secure, fast, and designed for modern workplaces.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{companyStats.totalEmployees.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Employees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{companyStats.onlineUsers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{companyStats.activeChats}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Chats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{companyStats.departments}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need for team communication
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with enterprise-grade security and designed for seamless collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-blue-400 mr-2" />
            <span className="text-xl font-semibold">CompanyChat</span>
          </div>
          <p className="text-gray-400 mb-4">
            Secure internal communication platform for modern teams
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>Enterprise Edition • Version 2.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
