import React from 'react'

export function SpaceParticles({ count = 20, className = '' }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 20,
    animationDuration: Math.random() * 10 + 10,
  }))

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full opacity-30 animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(168, 85, 247, 0.5)`,
          }}
        />
      ))}
    </div>
  )
}

export function CosmicOrbs({ count = 5, className = '' }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    left: Math.random() * 100,
    top: Math.random() * 100,
    hue: Math.random() * 60 + 260, // Purple to pink range
    animationDelay: Math.random() * 10,
  }))

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full opacity-10 animate-pulse"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            background: `radial-gradient(circle, hsl(${orb.hue}, 70%, 60%) 0%, transparent 70%)`,
            animationDelay: `${orb.animationDelay}s`,
            animationDuration: '8s',
          }}
        />
      ))}
    </div>
  )
}