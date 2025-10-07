"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent } from "../ui/card"
import { Separator } from "../ui/separator"
import { User } from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export function ProfileSettings() {
  const { toast } = useToast()
  const { user } = useAuth() // Get user from auth context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)

  // Set initial form data when user is available
  useEffect(() => {
    if (user) {
      setUserId(user.id)
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "/placeholder.svg",
      })
    }
  }, [user])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user profile
      await api.users.updateUser(userId, {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
      })

      // Update password if provided
      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error("New passwords don't match")
        }
        await api.users.changePassword(userId, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real implementation, you would upload the file to your server
      // and get back a URL. For now, we'll use a placeholder
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Show loading state if user data is not yet available
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Profile
        </h3>
        <p className="text-white/60">
          Configure your identity across the digital universe
        </p>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <Card className="w-full lg:w-[240px] flex-shrink-0 bg-background/20 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-primary/30 shadow-2xl">
                  <AvatarImage src={formData.avatar} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                    {formData.name ? formData.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-gold to-accent rounded-full flex items-center justify-center border-2 border-background">
                  <User className="h-4 w-4 text-background" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-primary/10 border-primary/30 text-white hover:bg-primary/20 transition-all duration-300"
                as="label"
              >
                🖼️ Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </Button>
            </CardContent>
          </Card>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-white font-medium flex items-center gap-2">
                  👤 Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300"
                  placeholder="Enter your cosmic name"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                  📧 Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300"
                  placeholder="your.email@cosmos.space"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="bio" className="text-white font-medium flex items-center gap-2">
                📝 Cosmic Biography
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="min-h-[120px] bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300 resize-none"
                placeholder="Tell the universe about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent flex items-center justify-center gap-2">
              🔐 Security Settings
            </h4>
            <p className="text-white/60">
              Update your password to secure your cosmic journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="current-password" className="text-white font-medium flex items-center gap-2">
                🔑 Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                className="bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300"
                placeholder="Enter your current password"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="new-password" className="text-white font-medium flex items-center gap-2">
                🆕 New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                className="bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-white font-medium flex items-center gap-2">
                ✅ Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                className="bg-background/20 border-primary/30 text-white placeholder-white/40 focus:border-primary/60 transition-all duration-300"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-primary via-accent to-primary text-white px-8 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Saving to Cosmos...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                💫 Save Cosmic Profile
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}