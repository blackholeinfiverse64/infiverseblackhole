import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Briefcase,
  Star,
  Globe,
  Layers,
  Network,
  Gauge
} from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"
import { useSocketContext } from "../../context/socket-context"

export function EnhancedDepartmentDashboard() {
  const [departments, setDepartments] = useState([])
  const [departmentStats, setDepartmentStats] = useState({})
  const [overallMetrics, setOverallMetrics] = useState({
    totalDepartments: 0,
    totalEmployees: 0,
    avgProductivity: 0,
    totalProjects: 0,
    activeProjects: 0,
    completionRate: 0,
    healthScore: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState('overview')
  const { toast } = useToast()
  const { events } = useSocketContext()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]
      
      if (latestEvent.type.includes('department')) {
        fetchDashboardData()
      }
    }
  }, [events])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      const [departmentsData, tasksData] = await Promise.all([
        api.departments.getDepartments(),
        api.tasks.getTasks()
      ])

      const departments = departmentsData.success ? departmentsData.data : departmentsData
      setDepartments(departments)

      // Calculate department statistics
      const stats = await calculateDepartmentStats(departments, tasksData)
      setDepartmentStats(stats.departmentStats)
      setOverallMetrics(stats.overallMetrics)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDepartmentStats = async (departments, tasks) => {
    const departmentStats = {}
    let totalEmployees = 0
    let totalProductivity = 0
    let totalProjects = 0
    let activeProjects = 0
    let completedTasks = 0
    let totalTasks = 0

    for (const dept of departments) {
      const deptId = dept._id || dept.id
      const deptTasks = tasks.filter(task => task.department?._id === deptId || task.department?.id === deptId)
      const activeTasks = deptTasks.filter(task => task.assignee && task.assignee._id)
      const completed = activeTasks.filter(task => task.status === 'Completed').length
      const activeMembers = dept.members ? dept.members.filter(member => member && member._id).length : 0
      
      // Calculate productivity score
      const productivity = activeTasks.length > 0 ? (completed / activeTasks.length * 100) : 0
      
      // Calculate recent activity
      const recentTasks = activeTasks.filter(task => {
        const taskDate = new Date(task.updatedAt || task.createdAt)
        const daysDiff = (new Date() - taskDate) / (1000 * 60 * 60 * 24)
        return daysDiff <= 7
      }).length

      // Calculate health score based on multiple factors
      const healthScore = Math.min(100, Math.max(0, 
        (productivity * 0.4) + 
        (activeMembers > 0 ? 20 : 0) + 
        (recentTasks > 0 ? 20 : 0) + 
        (dept.lead ? 20 : 0)
      ))

      departmentStats[deptId] = {
        totalTasks: activeTasks.length,
        completedTasks: completed,
        productivity: Math.round(productivity),
        activeMembers,
        recentActivity: recentTasks,
        healthScore: Math.round(healthScore),
        trend: Math.random() > 0.5 ? 'up' : 'down', // Mock trend
        projects: Math.floor(Math.random() * 10) + 5, // Mock projects
        activeProjects: Math.floor(Math.random() * 5) + 2 // Mock active projects
      }

      totalEmployees += activeMembers
      totalProductivity += productivity
      totalProjects += departmentStats[deptId].projects
      activeProjects += departmentStats[deptId].activeProjects
      completedTasks += completed
      totalTasks += activeTasks.length
    }

    const avgProductivity = departments.length > 0 ? totalProductivity / departments.length : 0
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0
    const healthScore = departments.length > 0 ? 
      Object.values(departmentStats).reduce((acc, stat) => acc + stat.healthScore, 0) / departments.length : 0

    return {
      departmentStats,
      overallMetrics: {
        totalDepartments: departments.length,
        totalEmployees,
        avgProductivity: Math.round(avgProductivity),
        totalProjects,
        activeProjects,
        completionRate: Math.round(completionRate),
        healthScore: Math.round(healthScore)
      }
    }
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-400" /> : 
      <TrendingDown className="h-4 w-4 text-red-400" />
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Departments Dashboard</h1>
          <p className="text-gray-400">Comprehensive overview of all departments and their performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchDashboardData}
            className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Departments</p>
                <p className="text-2xl font-bold text-white">{overallMetrics.totalDepartments}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-white">{overallMetrics.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg Productivity</p>
                <p className={`text-2xl font-bold ${getHealthColor(overallMetrics.avgProductivity)}`}>
                  {overallMetrics.avgProductivity}%
                </p>
              </div>
              <Gauge className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthColor(overallMetrics.healthScore)}`}>
                  {overallMetrics.healthScore}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Selector */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500">
            Performance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => {
              const deptId = department._id || department.id
              const stats = departmentStats[deptId] || {}
              
              return (
                <Card key={deptId} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: department.color }}
                        >
                          {department.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{department.name}</CardTitle>
                          <p className="text-sm text-gray-400">{department.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getHealthColor(stats.healthScore)} bg-slate-700/50`}>
                        {stats.healthScore || 0}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Department Lead */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={department.lead?.avatar} />
                        <AvatarFallback>
                          {department.lead?.name ? department.lead.name.charAt(0) : 'L'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {department.lead?.name || 'No lead assigned'}
                        </p>
                        <p className="text-xs text-gray-400">Department Lead</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Members</span>
                        </div>
                        <p className="text-lg font-semibold text-white">{stats.activeMembers || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Projects</span>
                        </div>
                        <p className="text-lg font-semibold text-white">{stats.projects || 0}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Productivity</span>
                        <div className="flex items-center gap-1">
                          <span className="text-white">{stats.productivity || 0}%</span>
                          {getPerformanceIcon(stats.trend)}
                        </div>
                      </div>
                      <Progress value={stats.productivity || 0} className="h-2" />
                    </div>

                    {/* Task Stats */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tasks Completed</span>
                      <span className="text-white">
                        {stats.completedTasks || 0}/{stats.totalTasks || 0}
                      </span>
                    </div>

                    {/* Recent Activity */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {stats.recentActivity || 0} recent updates
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Rankings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Department Performance Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments
                  .sort((a, b) => {
                    const statsA = departmentStats[a._id || a.id] || {}
                    const statsB = departmentStats[b._id || b.id] || {}
                    return (statsB.productivity || 0) - (statsA.productivity || 0)
                  })
                  .map((department, index) => {
                    const deptId = department._id || department.id
                    const stats = departmentStats[deptId] || {}
                    
                    return (
                      <div key={deptId} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-600 text-white font-bold">
                            {index + 1}
                          </div>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: department.color }}
                          >
                            {department.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{department.name}</h4>
                            <p className="text-sm text-gray-400">{stats.activeMembers || 0} members</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className={`font-semibold ${getHealthColor(stats.productivity || 0)}`}>
                              {stats.productivity || 0}%
                            </p>
                            <p className="text-xs text-gray-400">Productivity</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getHealthColor(stats.healthScore || 0)}`}>
                              {stats.healthScore || 0}%
                            </p>
                            <p className="text-xs text-gray-400">Health</p>
                          </div>
                          {getPerformanceIcon(stats.trend)}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Productivity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((department) => {
                    const deptId = department._id || department.id
                    const stats = departmentStats[deptId] || {}
                    
                    return (
                      <div key={deptId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{department.name}</span>
                          <span className="text-gray-400">{stats.productivity || 0}%</span>
                        </div>
                        <Progress value={stats.productivity || 0} className="h-3" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-400" />
                  Resource Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((department) => {
                    const deptId = department._id || department.id
                    const stats = departmentStats[deptId] || {}
                    const memberPercentage = overallMetrics.totalEmployees > 0 ? 
                      ((stats.activeMembers || 0) / overallMetrics.totalEmployees * 100) : 0
                    
                    return (
                      <div key={deptId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: department.color }}
                          />
                          <span className="text-white text-sm">{department.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-medium">{stats.activeMembers || 0}</span>
                          <span className="text-gray-400 text-sm ml-1">
                            ({memberPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}