import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "../context/auth-context" // Import the context

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Use login from AuthContext
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (validateForm()) {
      setLoading(true)
  
      try {
        await login(formData) // The login function handles navigation automatically
        console.log("Login successful - user data stored in localStorage")
      } catch (error) {
        console.error("Login error:", error)
        setErrors({ password: "Invalid email or password" })
      } finally {
        setLoading(false)
      }
    }
  }
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative overflow-hidden bg-black">
      {/* Enhanced Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0 cosmic-grid opacity-15"></div>
      
      {/* Enhanced Deep Space Nebula Effects with Blue Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '15s', animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/5 w-64 h-64 bg-blue-400/6 rounded-full blur-3xl animate-pulse" style={{animationDuration: '18s', animationDelay: '6s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/7 rounded-full blur-3xl animate-pulse" style={{animationDuration: '14s', animationDelay: '2s'}}></div>
      </div>

      {/* Revolving White Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Medium Blue Particles */}
        {[...Array(25)].map((_, i) => {
          const size = 3 + Math.random() * 3
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const duration = 15 + Math.random() * 20
          const delay = Math.random() * 10
          return (
            <div
              key={`medium-${i}`}
              className="absolute bg-blue-400 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                animation: `revolve135-medium ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${size * 3}px rgba(59, 130, 246, 0.9), 0 0 ${size * 6}px rgba(59, 130, 246, 0.6), 0 0 ${size * 9}px rgba(59, 130, 246, 0.3)`,
                opacity: 0.8 + Math.random() * 0.2
              }}
            />
          )
        })}

        {/* Small Blue Particles */}
        {[...Array(35)].map((_, i) => {
          const size = 2 + Math.random() * 2
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const duration = 10 + Math.random() * 15
          const delay = Math.random() * 8
          return (
            <div
              key={`small-${i}`}
              className="absolute bg-blue-300 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                animation: `revolve135-small ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${size * 4}px rgba(96, 165, 250, 0.8), 0 0 ${size * 7}px rgba(96, 165, 250, 0.5)`,
                opacity: 0.6 + Math.random() * 0.4
              }}
            />
          )
        })}
      </div>

      {/* CSS Animations for 135-degree Revolution */}
      <style jsx>{`
        @keyframes revolve135-medium {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100vw, 100vh); }
        }
        @keyframes revolve135-small {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(120vw, 120vh) rotate(360deg); }
        }
      `}</style>

      {/* Perfectly Centered Container */}
      <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-screen relative z-10">
        {/* Glassmorphism Card with Gold Border */}
        <Card className="w-full animate-scale-in bg-background/10 backdrop-blur-xl border-2 border-gold/30 shadow-2xl rounded-2xl overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5 pointer-events-none rounded-2xl"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-primary/20 to-gold/20 rounded-2xl blur-sm opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
        <CardHeader className="space-y-1 text-center relative z-10 p-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold via-primary to-gold p-0.5 rounded-2xl glow-gold animate-glow-pulse transform rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="w-full h-full rounded-xl bg-background/90 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-white glow-text mb-2">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Enter your credentials to access your cosmic workspace
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`transition-all duration-300 bg-background/20 backdrop-blur-sm border-gold/30 focus:border-gold/60 focus:ring-2 focus:ring-gold/20 text-white placeholder:text-white/50 rounded-xl ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                  }`}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 animate-slide-up flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-sm text-gold/70 hover:text-gold transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`transition-all duration-300 bg-background/20 backdrop-blur-sm border-gold/30 focus:border-gold/60 focus:ring-2 focus:ring-gold/20 text-white placeholder:text-white/50 rounded-xl ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                  }`}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 animate-slide-up flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
            <Button
              type="submit"
              className="w-full relative overflow-hidden group bg-gradient-to-r from-gold via-primary to-gold hover:glow-gold transition-all duration-500 transform hover:scale-105 text-background font-semibold py-3 text-lg rounded-xl border border-gold/30"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-pulse" />
                  Accessing Cosmic Workspace...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Enter Workspace
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-white/70">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-gold hover:text-gold/80 font-medium transition-colors duration-200 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  )
}