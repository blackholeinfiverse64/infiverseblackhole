"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Loader2, CheckCircle2, Clock, AlertTriangle, TrendingUp, Award, Target } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { SpaceParticles, CosmicOrbs } from "../ui/space-particles"
import { api } from "@/lib/api"

export function CompletedTasksStats() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    noSubmission: 0,
    byDepartment: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch completed tasks using the proper API method with authentication
        const tasks = await api.tasks.getTasks({ status: 'Completed' })

        // Fetch all submissions using the proper API method with authentication
        let submissions = []
        try {
          submissions = await api.get('/submissions')
        } catch (submissionError) {
          console.warn('Could not fetch submissions:', submissionError)
          // Continue without submissions data
          submissions = []
        }

        // Fetch departments using the proper API method
        const departmentsResponse = await api.departments.getDepartments()
        console.log('Departments response:', departmentsResponse)
        
        // Handle different response formats - check if it's wrapped in success/data structure
        let departments = []
        if (Array.isArray(departmentsResponse)) {
          departments = departmentsResponse
        } else if (departmentsResponse?.success && Array.isArray(departmentsResponse.data)) {
          departments = departmentsResponse.data
        } else if (departmentsResponse?.data && Array.isArray(departmentsResponse.data)) {
          departments = departmentsResponse.data
        } else {
          console.warn('Unexpected departments response format:', departmentsResponse)
          departments = []
        }

        console.log('Processed departments:', departments)

        // Calculate stats
        const total = Array.isArray(tasks) ? tasks.length : 0
        let approved = 0
        let pending = 0
        let rejected = 0
        let noSubmission = 0

        // Department stats initialization - ensure departments is an array
        const departmentStats = departments.map((dept) => ({
          id: dept._id,
          name: dept.name,
          color: dept.color,
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          noSubmission: 0,
        }))

        // Process tasks and submissions
        if (Array.isArray(tasks)) {
          tasks.forEach((task) => {
            const submission = Array.isArray(submissions) ? submissions.find((sub) => sub.task?._id === task._id) : null
            const deptIndex = task.department ? departmentStats.findIndex((d) => d.id === task.department._id) : -1

            if (deptIndex >= 0) {
              departmentStats[deptIndex].total++
            }

            if (submission) {
              if (submission.status === "Approved") {
                approved++
                if (deptIndex >= 0) departmentStats[deptIndex].approved++
              } else if (submission.status === "Rejected") {
                rejected++
                if (deptIndex >= 0) departmentStats[deptIndex].rejected++
              } else {
                pending++
                if (deptIndex >= 0) departmentStats[deptIndex].pending++
              }
            } else {
              noSubmission++
              if (deptIndex >= 0) departmentStats[deptIndex].noSubmission++
            }
          })
        }

        // Filter out departments with no completed tasks
        const filteredDeptStats = departmentStats.filter((dept) => dept.total > 0)

        setStats({
          total,
          approved,
          pending,
          rejected,
          noSubmission,
          byDepartment: filteredDeptStats,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Error",
          description: "Failed to load completion statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (isLoading) {
    return (
      <div className="relative">
        {/* Space Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <SpaceParticles count={30} className="opacity-30" />
        </div>
        
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl relative z-10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Mission Analytics</CardTitle>
                <CardDescription className="text-white/60">Analyzing completion data across the galaxy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              </div>
              <p className="text-white/70">Loading mission statistics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const submissionData = [
    { name: "Approved", value: stats.approved, color: "#22c55e" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
    { name: "No Submission", value: stats.noSubmission, color: "#94a3b8" },
  ].filter((item) => item.value > 0)

  return (
    <div className="relative">
      {/* Space Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <SpaceParticles count={40} className="opacity-30" />
      </div>
      
      <div className="absolute inset-0 opacity-15">
        <CosmicOrbs count={5} className="opacity-25" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>
      
      <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  Mission Analytics
                  <div className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-xs text-blue-300">
                    {stats.total} Total
                  </div>
                </CardTitle>
                <CardDescription className="text-white/60">Real-time completion data across the universe</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-white/60">Success Rate</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Enhanced Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 backdrop-blur-sm hover:from-green-500/15 hover:to-green-600/15 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-300 mb-1">Missions Approved</p>
                    <p className="text-2xl font-bold text-green-200 group-hover:text-green-100 transition-colors">{stats.approved}</p>
                    <p className="text-xs text-green-400/70 mt-1">
                      {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% success rate
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative bg-green-500/20 p-3 rounded-full border border-green-400/30 group-hover:border-green-300/50 transition-all">
                      <CheckCircle2 className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 backdrop-blur-sm hover:from-amber-500/15 hover:to-amber-600/15 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-amber-300 mb-1">Awaiting Review</p>
                    <p className="text-2xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors">{stats.pending}</p>
                    <p className="text-xs text-amber-400/70 mt-1">
                      {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% pending
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative bg-amber-500/20 p-3 rounded-full border border-amber-400/30 group-hover:border-amber-300/50 transition-all">
                      <Clock className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm hover:from-red-500/15 hover:to-red-600/15 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-red-300 mb-1">Mission Failed</p>
                    <p className="text-2xl font-bold text-red-200 group-hover:text-red-100 transition-colors">{stats.rejected}</p>
                    <p className="text-xs text-red-400/70 mt-1">
                      {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}% rejected
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative bg-red-500/20 p-3 rounded-full border border-red-400/30 group-hover:border-red-300/50 transition-all">
                      <AlertTriangle className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/30 backdrop-blur-sm hover:from-slate-500/15 hover:to-slate-600/15 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-300 mb-1">No Transmission</p>
                    <p className="text-2xl font-bold text-slate-200 group-hover:text-slate-100 transition-colors">{stats.noSubmission}</p>
                    <p className="text-xs text-slate-400/70 mt-1">
                      {stats.total > 0 ? Math.round((stats.noSubmission / stats.total) * 100) : 0}% missing
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-400/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative bg-slate-500/20 p-3 rounded-full border border-slate-400/30 group-hover:border-slate-300/50 transition-all">
                      <Target className="h-5 w-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-sm font-medium mb-4 text-white/80 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  Mission Progress Tracking
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Approved Missions</span>
                    <span className="text-sm font-medium text-green-300">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000 ease-out"
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Pending Review</span>
                    <span className="text-sm font-medium text-amber-300">{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out delay-200"
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Failed Missions</span>
                    <span className="text-sm font-medium text-red-300">{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 ease-out delay-400"
                      style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium mb-4 text-white/80">Galactic Distribution</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={submissionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      fontSize={12}
                      fill="#ffffff"
                    >
                      {submissionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke={entry.color}
                          strokeWidth={2}
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.3))'
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Enhanced Department Statistics */}
          {stats.byDepartment.length > 0 && (
            <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-6 text-white flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Target className="h-4 w-4 text-purple-400" />
                </div>
                Sector Performance Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.byDepartment.map((dept) => (
                  <div key={dept.id} className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-600/20 rounded-lg p-4 hover:border-purple-400/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${dept.color} shadow-lg`} />
                        <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{dept.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {dept.approved}/{dept.total}
                        </div>
                        <div className="text-xs text-white/60">missions</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">Success Rate</span>
                        <span className="text-green-300 font-medium">
                          {dept.total > 0 ? Math.round((dept.approved / dept.total) * 100) : 0}%
                        </span>
                      </div>
                      
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-800/50">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-1000"
                          style={{ width: `${dept.total > 0 ? (dept.approved / dept.total) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-1000 delay-100"
                          style={{ width: `${dept.total > 0 ? (dept.pending / dept.total) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-400 h-full transition-all duration-1000 delay-200"
                          style={{ width: `${dept.total > 0 ? (dept.rejected / dept.total) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-gradient-to-r from-slate-500 to-slate-400 h-full transition-all duration-1000 delay-300"
                          style={{ width: `${dept.total > 0 ? (dept.noSubmission / dept.total) * 100 : 0}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div className="text-center">
                          <div className="text-green-300 font-medium">{dept.approved}</div>
                          <div className="text-white/50">✓</div>
                        </div>
                        <div className="text-center">
                          <div className="text-amber-300 font-medium">{dept.pending}</div>
                          <div className="text-white/50">⏳</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-300 font-medium">{dept.rejected}</div>
                          <div className="text-white/50">✗</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-300 font-medium">{dept.noSubmission}</div>
                          <div className="text-white/50">⊘</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}