import React from 'react'

export function SpaceParticles({ count = 50, className = '' }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 3, // Clear, visible particles: 3-6px
    centerX: Math.random() * 100, // Center point X for orbit
    centerY: Math.random() * 100, // Center point Y for orbit
    animationDelay: Math.random() * 10, // Reduced random delay
    animationDuration: Math.random() * 40 + 60, // Much slower: 60-100 seconds
    orbitRadius: Math.random() * 50 + 20, // Smaller, more stable orbits
    rotationDirection: Math.random() > 0.5 ? 1 : -1, // Clockwise or counter-clockwise
  }))

  return (
    <>
      {/* CSS for circular revolving motion */}
      <style jsx>{`
        @keyframes revolve-clockwise {
          0% {
            transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
          }
        }

        @keyframes revolve-counter-clockwise {
          0% {
            transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
          }
          100% {
            transform: rotate(-360deg) translateX(var(--orbit-radius)) rotate(360deg);
          }
        }
        
        @keyframes white-particle-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }

        .particle-revolve {
          will-change: transform;
          animation: var(--revolve-direction) var(--duration) linear infinite, white-particle-glow 8s ease-in-out infinite;
          transform-origin: center;
          filter: none; /* Remove any blur */
          image-rendering: crisp-edges; /* Make particles sharp */
          -webkit-backface-visibility: hidden; /* Prevent blur on transform */
          backface-visibility: hidden;
        }

        .particle-revolve-clockwise {
          --revolve-direction: revolve-clockwise;
        }

        .particle-revolve-counter {
          --revolve-direction: revolve-counter-clockwise;
        }
      `}</style>
      
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute particle-revolve ${
              particle.rotationDirection > 0 ? 'particle-revolve-clockwise' : 'particle-revolve-counter'
            } bg-white rounded-full`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.centerX}%`,
              top: `${particle.centerY}%`,
              '--duration': `${particle.animationDuration}s`,
              '--orbit-radius': `${particle.orbitRadius}px`,
              animationDelay: `${particle.animationDelay}s`,
              boxShadow: `
                0 0 ${particle.size * 0.3}px rgba(255, 255, 255, 1),
                0 0 ${particle.size * 0.6}px rgba(255, 255, 255, 0.6)
              `,
              border: '1px solid rgba(255, 255, 255, 1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)', /* Ensure solid white core */
            }}
          />
        ))}
      </div>
    </>
  )
}

export function CosmicOrbs({ count = 8, className = '' }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 80,
    left: Math.random() * 100,
    top: Math.random() * 100,
    hue: Math.random() * 60 + 260, // Purple to pink range
    animationDelay: Math.random() * 8, // Reduced random delay
    pulseSpeed: Math.random() * 6 + 12, // Slower pulse: 12-18 seconds
  }))

  return (
    <>
      <style jsx>{`
        @keyframes cosmic-drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(15px, -20px) scale(1.02);
          }
          50% {
            transform: translate(-10px, 15px) scale(0.98);
          }
          75% {
            transform: translate(18px, 10px) scale(1.01);
          }
        }
        
        @keyframes cosmic-pulse {
          0%, 100% {
            opacity: 0.08;
            filter: blur(18px);
          }
          50% {
            opacity: 0.15;
            filter: blur(16px);
          }
        }

        .cosmic-orb {
          animation: cosmic-drift 80s ease-in-out infinite, cosmic-pulse var(--pulse-speed) ease-in-out infinite;
        }
      `}</style>
      
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute cosmic-orb rounded-full"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              background: `radial-gradient(circle at 30% 30%, 
                hsla(${orb.hue}, 80%, 70%, 0.4) 0%, 
                hsla(${orb.hue + 20}, 70%, 60%, 0.2) 40%, 
                transparent 70%)`,
              animationDelay: `${orb.animationDelay}s`,
              '--pulse-speed': `${orb.pulseSpeed}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}

// New Universe Background Component
export function UniverseBackground({ className = '' }) {
  return (
    <>
      <style jsx>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes nebula-flow {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(50px) translateY(-30px) rotate(90deg); }
          50% { transform: translateX(0) translateY(-60px) rotate(180deg); }
          75% { transform: translateX(-50px) translateY(-30px) rotate(270deg); }
          100% { transform: translateX(0) translateY(0) rotate(360deg); }
        }

        .star-field {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, white, transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, white, transparent),
            radial-gradient(2px 2px at 160px 30px, white, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: star-twinkle 12s ease-in-out infinite;
        }

        .nebula-clouds {
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
          animation: nebula-flow 120s linear infinite;
        }
      `}</style>
      
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
        {/* Deep space background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        
        {/* Star field */}
        <div className="absolute inset-0 star-field opacity-60" />
        
        {/* Nebula clouds */}
        <div className="absolute inset-0 nebula-clouds" />
        
        {/* Cosmic grid overlay */}
        <div className="absolute inset-0 cosmic-grid opacity-20" />
      </div>
    </>
  )
}