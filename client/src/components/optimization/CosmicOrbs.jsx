import React from 'react'

const CosmicOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {/* Large cosmic orb */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-600/20 blur-3xl animate-pulse"></div>
      
      {/* Medium cosmic orb */}
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-400/15 to-blue-600/15 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Small cosmic orb */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-bl from-pink-400/10 to-purple-600/10 blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Additional small orbs */}
      <div className="absolute top-32 left-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-600/10 blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full bg-gradient-to-l from-orange-400/10 to-red-600/10 blur-lg animate-pulse" style={{ animationDelay: '3s' }}></div>
      
      {/* Floating elements */}
      <div className="absolute top-40 left-10 w-6 h-6 rounded-full bg-blue-400/30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
      
      <div className="absolute bottom-40 right-10 w-4 h-4 rounded-full bg-purple-400/40 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
      
      <div className="absolute top-2/3 right-1/4 w-5 h-5 rounded-full bg-cyan-400/35 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
    </div>
  )
}

export default CosmicOrbs