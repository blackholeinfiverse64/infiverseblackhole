"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "../components/dashboard/sidebar"
import { DashboardHeader } from "../components/dashboard/header"
import { SpaceParticles, CosmicOrbs, UniverseBackground } from "../components/ui/space-particles"
import EnhancedStartDayDialog from "../components/attendance/EnhancedStartDayDialog"
import { useAuth } from "../context/auth-context"
import api from "../lib/api"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const [showStartDayDialog, setShowStartDayDialog] = useState(false)
  const [checkedPrompt, setCheckedPrompt] = useState(false)

  useEffect(() => {
    // Only check once after login
    if (!user || checkedPrompt) return

    const dateKey = new Date().toISOString().slice(0, 10)
    const storageKey = `startDayPromptShown:${user.id}:${dateKey}`

    // If user already started day previously or we've shown the prompt manually today, skip
    if (localStorage.getItem(storageKey)) {
      setCheckedPrompt(true)
      return
    }

    // Use verify endpoint to determine if the user can start day
    api
      .get(`/attendance/verify/${user.id}`)
      .then((res) => {
        const data = res?.data || res // handle both {success,data} and direct data
        if (data && data.canStartDay) {
          setShowStartDayDialog(true)
        }
      })
      .catch(() => {
        // On failure, do nothing; user can still start from Start Day page
      })
      .finally(() => {
        setCheckedPrompt(true)
      })
  }, [user, checkedPrompt])

  const handleStartDaySuccess = () => {
    if (!user) return
    const dateKey = new Date().toISOString().slice(0, 10)
    const storageKey = `startDayPromptShown:${user.id}:${dateKey}`
    localStorage.setItem(storageKey, "1")
    setShowStartDayDialog(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Add a class to the body to prevent scrolling when sidebar is open
    if (!sidebarOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }

  return (
    <div className="min-h-screen bg-background cosmic-background relative overflow-hidden">
      {/* LAYER 1: Base - Main Content Area with Enhanced Universe Background */}
      <main className="min-h-screen w-full relative">
        {/* Enhanced Universe Background with revolving particles */}
        <UniverseBackground />
        <SpaceParticles count={60} />
        <CosmicOrbs count={12} />
        
        {/* Content Area with proper padding for header and sidebar */}
        <div className="min-h-screen w-full pt-18 md:pl-80 overflow-auto space-scrollbar relative z-10">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-full mx-auto animate-fade-in">
              <Outlet />
              <EnhancedStartDayDialog
                isOpen={showStartDayDialog}
                onClose={() => setShowStartDayDialog(false)}
                onSuccess={handleStartDaySuccess}
              />
            </div>
          </div>
        </div>
      </main>

      {/* LAYER 2: Overlay - DashboardSidebar (Fixed Position) */}
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-80 z-50">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-lg transition-all duration-300 animate-fade-in"
          onClick={() => toggleSidebar()}
        />
      )}
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0 glow-primary' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar />
      </div>

      {/* LAYER 3: Overlay - DashboardHeader (Fixed Position) */}
      <div className="fixed top-0 right-0 left-0 md:left-80 z-40 h-18">
        <DashboardHeader sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />
      </div>
    </div>
  )
}