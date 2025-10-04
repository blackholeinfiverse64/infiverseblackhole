import { useState, useEffect } from "react"

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
      <div className="fixed inset-0 z-[9999] bg-background transition-opacity duration-500 opacity-0 pointer-events-none">
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden">
      {/* Enhanced Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
      <div className="absolute inset-0 cosmic-grid opacity-30 animate-pulse"></div>
      
      {/* Animated Cosmic Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/30 rounded-full blur-xl animate-float-cyber glow-primary"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/30 rounded-full blur-xl animate-float-cyber glow-accent" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gold/20 rounded-full blur-xl animate-float-cyber glow-gold" style={{animationDelay: '4s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-primary/25 rounded-full blur-xl animate-float-cyber" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/4 right-1/3 w-36 h-36 bg-accent/25 rounded-full blur-xl animate-float-cyber" style={{animationDelay: '3s'}}></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 px-4">
        {/* Blackhole Logo Container */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-gold via-primary to-accent opacity-30 blur-2xl animate-pulse"></div>
          
          {/* Main Blackhole Container */}
          <div className="relative w-40 h-40 mx-auto">
            {/* Event Horizon - Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gold/60 animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-2 rounded-full border-2 border-primary/50 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            <div className="absolute inset-4 rounded-full border border-accent/40 animate-spin" style={{animationDuration: '4s'}}></div>
            
            {/* Accretion Disk */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-r from-gold/30 via-primary/20 to-accent/30 animate-spin glow-primary" style={{animationDuration: '3s'}}></div>
            
            {/* Core Blackhole */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-transparent via-background/50 to-background border-2 border-gold/30 shadow-2xl">
              <div className="absolute inset-2 rounded-full bg-background/90 shadow-inner">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-background">
                  {/* Singularity */}
                  <div className="absolute inset-4 rounded-full bg-background border border-gold/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Gravitational Lensing Effect */}
            <div className="absolute -inset-4 rounded-full border border-gold/20 animate-ping" style={{animationDuration: '2s'}}></div>
            <div className="absolute -inset-6 rounded-full border border-primary/10 animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
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

      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float-cyber"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}