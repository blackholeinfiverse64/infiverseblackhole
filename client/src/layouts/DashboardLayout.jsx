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
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start with sidebar closed
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
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* LAYER 1: Enhanced Space Background - Similar to Splash Screen */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 cosmic-grid opacity-15"></div>
        
        {/* Enhanced Deep Space Nebula Effects with Blue Theme */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '15s', animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 right-1/5 w-64 h-64 bg-blue-400/6 rounded-full blur-3xl animate-pulse" style={{animationDuration: '18s', animationDelay: '6s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/7 rounded-full blur-3xl animate-pulse" style={{animationDuration: '14s', animationDelay: '2s'}}></div>
        </div>

        {/* Revolving Blue Particle System - Like Splash Screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Medium Blue Particles */}
          {[...Array(40)].map((_, i) => {
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
          {[...Array(60)].map((_, i) => {
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

          {/* Tiny Blue Particles */}
          {[...Array(80)].map((_, i) => {
            const size = 1 + Math.random() * 1.5
            const startX = Math.random() * 100
            const startY = Math.random() * 100
            const duration = 8 + Math.random() * 12
            const delay = Math.random() * 6
            return (
              <div
                key={`tiny-${i}`}
                className="absolute bg-blue-200 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${startX}%`,
                  top: `${startY}%`,
                  animation: `revolve135-tiny ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 ${size * 5}px rgba(147, 197, 253, 0.7), 0 0 ${size * 8}px rgba(147, 197, 253, 0.4)`,
                  opacity: 0.5 + Math.random() * 0.3
                }}
              />
            )
          })}
        </div>
      </div>

      {/* LAYER 2: Main Content Area */}
      <main className="min-h-screen w-full relative">        
        {/* Content Area with proper padding for header and sidebar */}
        <div className={`min-h-screen w-full pt-18 transition-all duration-200 overflow-auto space-scrollbar relative z-10 ${
          sidebarOpen ? 'md:pl-80' : 'md:pl-0'
        }`}>
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

      {/* LAYER 3: Overlay - DashboardSidebar (Fixed Position) */}
      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed left-0 top-0 bottom-0 w-80 z-50 will-change-transform transition-transform duration-200 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
          onClick={() => toggleSidebar()}
        />
      )}
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 will-change-transform transition-transform duration-200 ease-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar />
      </div>

      {/* LAYER 4: Overlay - DashboardHeader (Fixed Position) */}
      <div className={`fixed top-0 right-0 left-0 z-40 h-18 will-change-auto transition-all duration-200 ${
        sidebarOpen ? 'md:left-80' : 'md:left-0'
      }`}>
        <DashboardHeader sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />
      </div>

      {/* CSS Animations for Revolving Particles */}
      <style jsx>{`
        @keyframes revolve135-medium {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100vw, 100vh);
          }
        }

        @keyframes revolve135-small {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(120vw, 120vh) rotate(360deg);
          }
        }

        @keyframes revolve135-tiny {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(110vw, 110vh);
          }
        }
      `}</style>
    </div>
  )
}