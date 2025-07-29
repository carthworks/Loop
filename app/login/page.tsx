"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle, Eye, EyeOff, ArrowLeft, Shield, Users, Building } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthGuard } from "@/components/auth-guard"

// Sample user data for demonstration
const sampleUsers = [
  {
    email: "john.doe@company.com",
    password: "password123",
    name: "John Doe",
    department: "Engineering",
    role: "Senior Developer"
  },
  {
    email: "sarah.johnson@company.com",
    password: "password123",
    name: "Sarah Johnson",
    department: "Marketing",
    role: "Marketing Manager"
  },
  {
    email: "admin@company.com",
    password: "admin123",
    name: "Admin User",
    department: "IT",
    role: "System Administrator"
  }
]

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check credentials against sample data
    const user = sampleUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Store user data in localStorage (in real app, use proper auth)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      
      // Redirect to chat list
      router.push('/dashboard')
    } else {
      setError("Invalid email or password. Try one of the sample accounts.")
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("password123")
  }

  const handleBackToWelcome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={handleBackToWelcome} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Welcome
        </Button>
      </div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in to CompanyChat
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Demo Accounts
            </CardTitle>
            <CardDescription>
              Click on any account below to auto-fill the login form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleUsers.map((user, index) => (
              <div
                key={index}
                onClick={() => handleDemoLogin(user.email)}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{user.department}</div>
                    <div className="text-xs text-gray-400">{user.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                Secure Enterprise Login
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                This is a demo environment. In production, this would integrate with your company's SSO system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building className="w-4 h-4" />
            <span>CompanyChat Enterprise</span>
          </div>
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginContent />
    </AuthGuard>
  )
}
