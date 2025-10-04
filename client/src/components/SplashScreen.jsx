import { useState, useEffect } from "react"
import blackholeLogo from "../assets/blackhole.png"

export function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 100) // 10 seconds total (100 steps * 100ms)

    // Auto hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 500) // Wait for fade out animation
    }, 10000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black transition-opacity duration-500 opacity-0 pointer-events-none">
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 px-4">
        {/* Blackhole Logo Image */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 via-white/10 to-gray-400/10 blur-3xl animate-pulse"></div>
          
          {/* Blackhole Image Container */}
          <div className="relative w-48 h-48 mx-auto">
            {/* Rotating Event Horizon Ring */}
            <div className="absolute -inset-4 rounded-full border border-gray-400/30 animate-spin" style={{animationDuration: '10s'}}></div>
            <div className="absolute -inset-6 rounded-full border border-white/20 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
            
            {/* Blackhole Image */}
            <img 
              src={blackholeLogo} 
              alt="Blackhole Logo" 
              className="w-full h-full object-contain drop-shadow-2xl animate-pulse"
              style={{animationDuration: '3s'}}
            />
            
            {/* Gravitational Lensing Effects */}
            <div className="absolute -inset-8 rounded-full border border-gray-300/15 animate-ping" style={{animationDuration: '2s'}}></div>
            <div className="absolute -inset-10 rounded-full border border-white/10 animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gold via-primary to-accent bg-clip-text text-transparent animate-glow-pulse">
            Infiverse
          </h1>
          <p className="text-xl text-white/70 font-medium tracking-wider">
            Blackhole Edition
          </p>
          <div className="flex items-center justify-center space-x-2 text-gold/60">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            <p className="text-sm font-mono tracking-widest">INITIALIZING COSMIC WORKSPACE</p>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="w-full bg-background/50 rounded-full h-2 backdrop-blur-sm border border-gold/20">
            <div 
              className="bg-gradient-to-r from-gold via-primary to-accent h-full rounded-full transition-all duration-100 ease-out glow-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-white/50 font-mono">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gold rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>

      {/* Large Scale Revolving White Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Medium Blue Particles */}
        {[...Array(40)].map((_, i) => {
          const size = 3 + Math.random() * 3 // 3-6px for better visibility
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const duration = 15 + Math.random() * 20 // 15-35s
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
                boxShadow: `
                  0 0 ${size * 3}px rgba(59, 130, 246, 0.9),
                  0 0 ${size * 6}px rgba(59, 130, 246, 0.6),
                  0 0 ${size * 9}px rgba(59, 130, 246, 0.3)
                `,
                opacity: 0.8 + Math.random() * 0.2
              }}
            />
          )
        })}

        {/* Small Blue Particles */}
        {[...Array(60)].map((_, i) => {
          const size = 2 + Math.random() * 2 // 2-4px for better visibility
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const duration = 10 + Math.random() * 15 // 10-25s
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
                boxShadow: `
                  0 0 ${size * 4}px rgba(96, 165, 250, 0.8),
                  0 0 ${size * 7}px rgba(96, 165, 250, 0.5)
                `,
                opacity: 0.6 + Math.random() * 0.4
              }}
            />
          )
        })}

        {/* Tiny Blue Particles */}
        {[...Array(80)].map((_, i) => {
          const size = 1 + Math.random() * 1.5 // 1-2.5px for better visibility
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const duration = 8 + Math.random() * 12 // 8-20s
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
                boxShadow: `
                  0 0 ${size * 5}px rgba(147, 197, 253, 0.7),
                  0 0 ${size * 8}px rgba(147, 197, 253, 0.4)
                `,
                opacity: 0.5 + Math.random() * 0.3
              }}
            />
          )
        })}
      </div>

      {/* CSS Animations for 135-degree Revolution */}
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