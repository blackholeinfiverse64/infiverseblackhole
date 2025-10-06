"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Loader2, TrendingUp, TrendingDown, Users, Target, CheckCircle, Clock } from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function DepartmentStats({ onDepartmentSelect }) {
  const { toast } = useToast()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredDept, setHoveredDept] = useState(null)

  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        setIsLoading(true)
        const data = await api.dashboard.getDepartmentStats()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching department stats:", error)
        toast({
          title: "Error",
          description: "Failed to load department statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartmentStats()
  }, [toast])

  const getProgressStatus = (completed, total) => {
    if (total === 0) return { status: 'empty', color: 'text-muted-foreground' }
    const percentage = (completed / total) * 100
    if (percentage >= 90) return { status: 'excellent', color: 'text-green-500' }
    if (percentage >= 70) return { status: 'good', color: 'text-blue-500' }
    if (percentage >= 50) return { status: 'average', color: 'text-yellow-500' }
    return { status: 'needs-attention', color: 'text-red-500' }
  }

  const getProgressGradient = (completed, total) => {
    if (total === 0) return 'from-gray-400 to-gray-500'
    const percentage = (completed / total) * 100
    if (percentage >= 90) return 'from-green-400 to-green-600'
    if (percentage >= 70) return 'from-blue-400 to-blue-600'
    if (percentage >= 50) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  if (isLoading) {
    return (
      <Card className="col-span-1 glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Department Progress</CardTitle>
              <CardDescription className="text-white/70">Task completion by department</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary/20 animate-ping" />
            </div>
            <p className="text-white/80 animate-pulse">Loading departments...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (departments.length === 0) {
    return (
      <Card className="col-span-1 glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Department Progress</CardTitle>
              <CardDescription className="text-white/70">Task completion by department</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-white/60 mb-2">No department data available</p>
            <p className="text-xs text-white/40">Check back later for updates</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 glass-card border border-primary/20 bg-background/10 backdrop-blur-md hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Department Progress</CardTitle>
              <CardDescription className="text-white/70">Task completion overview</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80 font-medium">{departments.length} Departments</div>
            <div className="text-xs text-white/60">Active</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {departments.map((department) => {
            const progressStatus = getProgressStatus(department.completed || 0, department.total || 0)
            const progressPercentage = department.total > 0 ? (department.completed / department.total) * 100 : 0
            const isHovered = hoveredDept === department._id || hoveredDept === department.id || hoveredDept === department.name
            
            return (
              <div 
                key={department._id || department.id || department.name} 
                className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                  ${isHovered 
                    ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10 scale-[1.02]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
                onMouseEnter={() => setHoveredDept(department._id || department.id || department.name)}
                onMouseLeave={() => setHoveredDept(null)}
              >
                {/* Department Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-4 h-4 rounded-full ring-2 ring-white/20 transition-all duration-300 ${isHovered ? 'scale-110 ring-white/40' : ''}`}
                      style={{ backgroundColor: department.color || '#6366f1' }}
                    />
                    <div>
                      <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300">
                        {department.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <CheckCircle className="h-3 w-3" />
                          <span>{department.completed || 0} completed</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <Clock className="h-3 w-3" />
                          <span>{(department.total || 0) - (department.completed || 0)} pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold ${progressStatus.color}`}>
                        {Math.round(progressPercentage)}%
                      </span>
                      {progressPercentage >= 70 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : progressPercentage >= 50 ? (
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <span className="text-xs text-white/60">
                      {department.total || 0} total tasks
                    </span>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressGradient(department.completed || 0, department.total || 0)} 
                        transition-all duration-700 ease-out relative overflow-hidden`}
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                  </div>
                  
                  {/* Progress segments for visual feedback */}
                  <div className="absolute top-0 w-full h-3 flex">
                    {[25, 50, 75].map((mark) => (
                      <div 
                        key={mark}
                        className="absolute w-0.5 h-full bg-white/20"
                        style={{ left: `${mark}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${progressStatus.status === 'excellent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      progressStatus.status === 'good' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      progressStatus.status === 'average' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      progressStatus.status === 'needs-attention' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                    {progressStatus.status === 'excellent' ? '🎯 Excellent' :
                     progressStatus.status === 'good' ? '✅ Good Progress' :
                     progressStatus.status === 'average' ? '⚡ Average' :
                     progressStatus.status === 'needs-attention' ? '⚠️ Needs Attention' :
                     '⭕ No Tasks'
                    }
                  </span>
                  
                  {isHovered && (
                    <span className="text-xs text-primary animate-pulse">
                      Click to view details →
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
