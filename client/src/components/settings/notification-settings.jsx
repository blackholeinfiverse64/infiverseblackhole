"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskAssigned: true,
    taskUpdated: true,
    taskCompleted: true,
    commentAdded: true,
    aiSuggestions: true,
    dailyDigest: false,
    weeklyReport: true,
    notificationMethod: "email-and-app",
    notificationFrequency: "immediate",
  })

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Notification settings updated successfully!")
    }, 1000)
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Cosmic Notifications
        </h3>
        <p className="text-white/60">Configure your intergalactic communication preferences</p>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/20">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="font-medium text-white flex items-center gap-2">
                📧 Email Notifications
              </Label>
              <p className="text-sm text-white/60">Receive email notifications for important cosmic updates</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
            />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent mb-2">
                📋 Task Notifications
              </h4>
              <p className="text-white/60 text-sm">Stay updated on your cosmic missions</p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="task-assigned" className="cursor-pointer text-white flex items-center gap-2">
                  🎯 When a task is assigned to me
                </Label>
                <Switch
                  id="task-assigned"
                  checked={settings.taskAssigned}
                  onCheckedChange={() => handleToggle("taskAssigned")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="task-updated" className="cursor-pointer text-white flex items-center gap-2">
                  🔄 When a task I'm assigned to is updated
                </Label>
                <Switch
                  id="task-updated"
                  checked={settings.taskUpdated}
                  onCheckedChange={() => handleToggle("taskUpdated")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="task-completed" className="cursor-pointer text-white flex items-center gap-2">
                  ✅ When a task I'm assigned to is completed
                </Label>
                <Switch
                  id="task-completed"
                  checked={settings.taskCompleted}
                  onCheckedChange={() => handleToggle("taskCompleted")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="comment-added" className="cursor-pointer text-white flex items-center gap-2">
                  💬 When someone comments on my task
                </Label>
                <Switch
                  id="comment-added"
                  checked={settings.commentAdded}
                  onCheckedChange={() => handleToggle("commentAdded")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                🤖 AI and Reports
              </h4>
              <p className="text-white/60 text-sm">Customize your AI assistance and analytics</p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="ai-suggestions" className="cursor-pointer text-white flex items-center gap-2">
                  🧠 AI optimization suggestions
                </Label>
                <Switch
                  id="ai-suggestions"
                  checked={settings.aiSuggestions}
                  onCheckedChange={() => handleToggle("aiSuggestions")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="daily-digest" className="cursor-pointer text-white flex items-center gap-2">
                  📅 Daily activity digest
                </Label>
                <Switch
                  id="daily-digest"
                  checked={settings.dailyDigest}
                  onCheckedChange={() => handleToggle("dailyDigest")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/10 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <Label htmlFor="weekly-report" className="cursor-pointer text-white flex items-center gap-2">
                  📊 Weekly performance report
                </Label>
                <Switch
                  id="weekly-report"
                  checked={settings.weeklyReport}
                  onCheckedChange={() => handleToggle("weeklyReport")}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-background/20"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <div className="space-y-6 p-6 bg-background/10 rounded-xl border border-primary/20">
            <div className="text-center">
              <h4 className="text-lg font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent mb-2">
                🛸 Delivery Preferences
              </h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-method" className="text-white font-medium mb-3 block">
                  📡 Notification Method
                </Label>
                <RadioGroup
                  id="notification-method"
                  value={settings.notificationMethod}
                  onValueChange={(value) => handleChange("notificationMethod", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/20 border border-primary/10">
                    <RadioGroupItem value="email-only" id="email-only" className="border-primary data-[state=checked]:bg-primary" />
                    <Label htmlFor="email-only" className="text-white cursor-pointer">📧 Email only</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/20 border border-primary/10">
                    <RadioGroupItem value="app-only" id="app-only" className="border-primary data-[state=checked]:bg-primary" />
                    <Label htmlFor="app-only" className="text-white cursor-pointer">📱 In-app only</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/20 border border-primary/10">
                    <RadioGroupItem value="email-and-app" id="email-and-app" className="border-primary data-[state=checked]:bg-primary" />
                    <Label htmlFor="email-and-app" className="text-white cursor-pointer">🌐 Email and in-app</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notification-frequency" className="text-white font-medium">⏰ Notification Frequency</Label>
                <Select
                  value={settings.notificationFrequency}
                  onValueChange={(value) => handleChange("notificationFrequency", value)}
                >
                  <SelectTrigger id="notification-frequency" className="bg-background/20 border-primary/30 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-primary/30">
                    <SelectItem value="immediate" className="text-white hover:bg-primary/20">⚡ Immediate</SelectItem>
                    <SelectItem value="hourly" className="text-white hover:bg-primary/20">🕐 Hourly digest</SelectItem>
                    <SelectItem value="daily" className="text-white hover:bg-primary/20">📅 Daily digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                Updating Cosmos...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                🔔 Save Notification Settings
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
