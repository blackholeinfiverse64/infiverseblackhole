import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Brain,
  Zap
} from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function DepartmentAnalytics({ departments }) {
  const [analytics, setAnalytics] = useState({
    performanceMetrics: {},
    resourceUtilization: {},
    recommendations: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('productivity')
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [selectedTimeframe])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const tasksData = await api.tasks.getTasks()
      const analyticsData = generateAdvancedAnalytics(departments, tasksData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAdvancedAnalytics = (departments, tasks) => {
    const performanceMetrics = {}
    const resourceUtilization = {}
    
    departments.forEach(dept => {
      const deptId = dept._id || dept.id
      const deptTasks = tasks.filter(task => task.department?._id === deptId || task.department?.id === deptId)
      
      const completedTasks = deptTasks.filter(task => task.status === 'Completed').length
      const totalTasks = deptTasks.length
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0
      
      performanceMetrics[deptId] = {
        completionRate: Math.round(completionRate),
        totalTasks,
        completedTasks,
        efficiency: Math.max(0, completionRate)
      }
      
      const activeMembers = dept.members ? dept.members.filter(member => member && member._id).length : 0
      const tasksPerMember = activeMembers > 0 ? totalTasks / activeMembers : 0
      
      resourceUtilization[deptId] = {
        activeMembers,
        tasksPerMember: Math.round(tasksPerMember * 10) / 10,
        utilizationRate: Math.min(100, tasksPerMember * 10)
      }
    })
    
    return {
      performanceMetrics,
      resourceUtilization,
      recommendations: []
    }
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Department Analytics
            </CardTitle>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="productivity" className="data-[state=active]:bg-purple-500">Productivity</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500">Performance</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-500">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => {
              const deptId = dept._id || dept.id
              const performance = analytics.performanceMetrics[deptId] || {}
              
              return (
                <Card key={deptId} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        <h4 className="font-medium text-white">{dept.name}</h4>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Completion Rate</p>
                        <p className={`text-lg font-bold ${getHealthColor(performance.completionRate || 0)}`}>
                          {performance.completionRate || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Efficiency</p>
                        <p className={`text-lg font-bold ${getHealthColor(performance.efficiency || 0)}`}>
                          {performance.efficiency || 0}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{performance.completionRate || 0}%</span>
                      </div>
                      <Progress value={performance.completionRate || 0} className="h-2" />
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Tasks: <span className="text-white">{performance.completedTasks || 0}/{performance.totalTasks || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map(dept => {
              const deptId = dept._id || dept.id
              const performance = analytics.performanceMetrics[deptId] || {}
              
              return (
                <Card key={deptId} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      {dept.name} Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{performance.totalTasks || 0}</p>
                        <p className="text-sm text-gray-400">Total Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{performance.completedTasks || 0}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => {
              const deptId = dept._id || dept.id
              const resources = analytics.resourceUtilization[deptId] || {}
              
              return (
                <Card key={deptId} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      {dept.name} Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Members</span>
                        <span className="text-white font-medium">{resources.activeMembers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tasks per Member</span>
                        <span className="text-white font-medium">{resources.tasksPerMember || 0}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Utilization Rate</span>
                        <span className="text-white">{Math.round(resources.utilizationRate || 0)}%</span>
                      </div>
                      <Progress value={resources.utilizationRate || 0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}