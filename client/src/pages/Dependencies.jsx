import React, { useState, useEffect } from "react"
import { DependencyControls } from "../components/dependencies/dependency-controls"
import { DependencyGraph } from "../components/dependencies/dependency-graph"
import { SpaceParticles, CosmicOrbs } from "../components/ui/space-particles"
import { api } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { 
  GitBranch, 
  Target, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react"

export function Dependencies() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalDependencies: 0,
    completedTasks: 0,
    blockedTasks: 0,
    avgCompletionTime: 0,
    criticalPath: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [tasksData] = await Promise.all([
          api.tasks.getTasks(),
          api.departments.getDepartments()
        ])

        // Calculate dependency statistics
        const totalTasks = tasksData.length
        const totalDependencies = tasksData.reduce((acc, task) => {
          return acc + (task.dependencies ? task.dependencies.length : 0)
        }, 0)
        const completedTasks = tasksData.filter(task => task.status === 'Completed').length
        const blockedTasks = tasksData.filter(task => {
          return task.dependencies && task.dependencies.some(dep => 
            tasksData.find(t => t._id === dep._id)?.status !== 'Completed'
          )
        }).length

        setStats({
          totalTasks,
          totalDependencies,
          completedTasks,
          blockedTasks,
          avgCompletionTime: Math.round(Math.random() * 5 + 3), // Placeholder
          criticalPath: tasksData.slice(0, 3) // Placeholder
        })
        
      } catch (error) {
        console.error('Error fetching dependency stats:', error)
        setError(error.message || 'Failed to load data')
        toast({
          title: "Error",
          description: "Failed to load dependency statistics",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks * 100).toFixed(1) : 0
  const dependencyRatio = stats.totalTasks > 0 ? (stats.totalDependencies / stats.totalTasks).toFixed(1) : 0

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Dependencies...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Cosmic Background */}
      <SpaceParticles count={60} className="opacity-70" />
      <CosmicOrbs count={8} className="opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Task Dependencies
          </h1>
          <p className="text-white text-base lg:text-lg max-w-2xl mx-auto px-4">
            Visualize and manage task dependencies to optimize workflow and identify bottlenecks
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Total Tasks</CardTitle>
              <Target className="h-3 w-3 lg:h-4 lg:w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-white">{stats.totalTasks}</div>
              <p className="text-xs text-white">
                {stats.totalDependencies} deps
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Completion</CardTitle>
              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-white">{completionRate}%</div>
              <p className="text-xs text-white">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Blocked</CardTitle>
              <XCircle className="h-3 w-3 lg:h-4 lg:w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-white">{stats.blockedTasks}</div>
              <p className="text-xs text-white">
                Waiting
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Avg Deps</CardTitle>
              <GitBranch className="h-3 w-3 lg:h-4 lg:w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-white">{dependencyRatio}</div>
              <p className="text-xs text-white">
                Per task
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <DependencyControls />
        </div>

        {/* Graph */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <DependencyGraph />
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base lg:text-lg">
                <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400" />
                Critical Path Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.criticalPath.length > 0 ? (
                  stats.criticalPath.map((task, index) => (
                    <div key={task._id} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{task.title}</p>
                        <p className="text-white text-xs truncate">{task.department?.name || 'No Department'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-sm">No critical path identified</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base lg:text-lg">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 lg:p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-white text-sm font-medium">Parallel Processing</p>
                  <p className="text-white text-xs">
                    {stats.blockedTasks > 0 ? `${stats.blockedTasks} tasks can be optimized` : 'All tasks optimized'}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-white text-sm font-medium">Dependency Reduction</p>
                  <p className="text-white text-xs">
                    Consider breaking down complex dependencies
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <p className="text-white text-sm font-medium">Resource Allocation</p>
                  <p className="text-white text-xs">
                    Focus on critical path tasks first
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
