import React, { useState, useEffect } from "react"
import { OptimizationHeader } from "../components/optimization/optimization-header"
import { OptimizationInsights } from "../components/optimization/optimization-insights"
import { OptimizationActions } from "../components/optimization/optimization-actions"
import { SpaceParticles, CosmicOrbs } from "../components/ui/space-particles"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { api } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import {
  Brain,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Activity,
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

function Optimization() {
  const [insights, setInsights] = useState([])
  const [aiStats, setAiStats] = useState({
    totalOptimizations: 0,
    activeInsights: 0,
    potentialSavings: 0,
    efficiencyGain: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const insightsData = await api.ai.getInsights()
        const tasksData = await api.tasks.getTasks()
        
        setInsights(insightsData || [])
        
        // Calculate AI optimization statistics
        const totalOptimizations = insightsData?.length || 0
        const highImpactInsights = insightsData?.filter(i => i.impact === 'High').length || 0
        const completedTasks = tasksData?.filter(t => t.status === 'Completed').length || 0
        const totalTasks = tasksData?.length || 1
        
        setAiStats({
          totalOptimizations,
          activeInsights: highImpactInsights,
          potentialSavings: Math.round((totalOptimizations * 2.5)), // Mock calculation
          efficiencyGain: Math.round((completedTasks / totalTasks) * 100)
        })
        
      } catch (error) {
        console.error('Error fetching optimization data:', error)
        toast({
          title: "Error",
          description: "Failed to load AI optimization data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      {/* LAYER 1: Transparent Background with subtle overlay */}
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="absolute inset-0 cosmic-grid opacity-5"></div>
      
      {/* LAYER 2: Ambient AI Neural Network Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/6 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '14s', animationDelay: '6s'}}></div>
        
        {/* Neural network lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-gradient-to-b from-blue-400/20 to-transparent transform rotate-45 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-24 bg-gradient-to-b from-purple-400/20 to-transparent transform -rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/2 left-1/2 w-1 h-28 bg-gradient-to-b from-cyan-400/20 to-transparent transform rotate-12 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      {/* LAYER 3: AI Cosmic Particles */}
      <SpaceParticles count={80} className="opacity-60" />
      <CosmicOrbs count={12} className="opacity-25" />
      
      {/* LAYER 4: Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* SUBLAYER 4.1: Enhanced Header */}
        <div className="flex-none bg-transparent backdrop-blur-sm border-b border-white/5">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center space-y-8">
              {/* Title and Description */}
              <div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  AI Optimization
                </h1>
                <p className="text-white/80 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
                  Harness the power of artificial intelligence to analyze, optimize, and transform your workflow with cosmic precision
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBLAYER 4.2: AI Performance Dashboard */}
        <div className="flex-none bg-transparent">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              
              {/* Total Optimizations */}
              <Card className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">AI Suggestions</CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
                    <Brain className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{aiStats.totalOptimizations}</div>
                  <p className="text-xs text-blue-300 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Generated insights
                  </p>
                </CardContent>
              </Card>

              {/* High Impact Insights */}
              <Card className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">High Impact</CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all duration-300">
                    <Target className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{aiStats.activeInsights}</div>
                  <p className="text-xs text-purple-300">
                    Critical optimizations
                  </p>
                </CardContent>
              </Card>

              {/* Potential Savings */}
              <Card className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">Time Savings</CardTitle>
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                    <Clock className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{aiStats.potentialSavings}h</div>
                  <p className="text-xs text-green-300">
                    Estimated weekly savings
                  </p>
                </CardContent>
              </Card>

              {/* Efficiency Gain */}
              <Card className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">Efficiency</CardTitle>
                  <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-all duration-300">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{aiStats.efficiencyGain}%</div>
                  <p className="text-xs text-cyan-300">
                    Workflow optimization
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* SUBLAYER 4.3: Main Content Grid */}
        <div className="flex-1 bg-transparent">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* AI Insights - Takes 2 columns */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl min-h-[600px]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      Neural Network Analysis
                      {isLoading && (
                        <div className="ml-auto">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <OptimizationInsights insights={insights} />
                  </CardContent>
                </Card>
              </div>

              {/* Actions Panel */}
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-purple-500/20 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                      </div>
                      Control Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OptimizationActions insights={insights} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Optimization
