"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import {
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Github,
  ExternalLink,
  Bell,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Target,
  BarChart3,
  TrendingUp
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../context/auth-context"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { SubmissionFeedbackCard } from "../components/dashboard/SubmissionFeedbackCard"
import { DashboardProvider } from "../context/DashboardContext" // New import
import { api } from "@/lib/api"
import { WorkHoursManager } from "../components/monitoring/WorkHoursManager"
import SpaceParticles from "../components/optimization/SpaceParticles"
import CosmicOrbs from "../components/optimization/CosmicOrbs"

function UserDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [userStats, setUserStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    upcomingDeadlines: [],
    completionRate: 0,
  })
  const [userTasks, setUserTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isSubmissionDetailsOpen, setIsSubmissionDetailsOpen] = useState(false)
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState("")
  const [hasNewReviews, setHasNewReviews] = useState(false)
  const [recentReviews, setRecentReviews] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  const TASKS_PER_PAGE = 5

  const handleViewTask = (task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setIsSubmissionDetailsOpen(true)
  }

  const handleSubmitRevision = async () => {
    if (!selectedSubmission || !revisionNotes.trim()) return

    try {
      setIsLoading(true)
      
      // ✅ FIXED: Use authenticated API method
      await api.post('/submissions', {
        task: selectedSubmission.task._id,
        githubLink: selectedSubmission.githubLink,
        additionalLinks: selectedSubmission.additionalLinks,
        notes: revisionNotes,
        originalSubmission: selectedSubmission._id,
        userId: user.id,
      })

      toast({
        title: "Success",
        description: "Your revision has been submitted successfully",
      })

      setIsRevisionDialogOpen(false)
      fetchUserDashboardData()
    } catch (error) {
      console.error("Error submitting revision:", error)
      toast({
        title: "Error",
        description: "Failed to submit revision",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markReviewsAsSeen = async () => {
    try {
      setHasNewReviews(false)
      setRecentReviews([]) // Clear recentReviews
      // Optional: Add API call to mark reviews as seen
      // await api.post(`/users/${user.id}/mark-reviews-seen`, {});
    } catch (error) {
      console.error("Error marking reviews as seen:", error)
    }
  }

  const fetchUserDashboardData = async () => {
    const storedUser = JSON.parse(localStorage.getItem("WorkflowUser"))
    if (!storedUser?.id) {
      console.error("User ID is undefined")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // ✅ FIXED: Use authenticated API methods instead of direct axios calls
      const [statsResponse, tasksResponse, submissionsResponse] = await Promise.all([
        api.dashboard.getUserStats(storedUser.id),
        api.users.getUserTasks(storedUser.id),
        api.get(`/users/${storedUser.id}/submissions`)
      ])

      console.log('Dashboard data fetched:', {
        stats: statsResponse,
        tasks: tasksResponse?.length || 0,
        submissions: submissionsResponse?.length || 0
      })

      const recentlyReviewed = (submissionsResponse || []).filter((submission) => {
        if (submission.status !== "Pending") {
          const reviewDate = new Date(submission.updatedAt)
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          return reviewDate > sevenDaysAgo
        }
        return false
      })

      const sortedTasks = (tasksResponse || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

      setUserStats(statsResponse || {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        upcomingDeadlines: [],
        completionRate: 0,
      })
      setUserTasks(sortedTasks)
      setSubmissions(submissionsResponse || [])
      setRecentReviews(recentlyReviewed)
      setHasNewReviews(recentlyReviewed.length > 0)
      setCurrentPage(0)
    } catch (error) {
      console.error("Error fetching user dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load your dashboard data. Please check your connection and try again.",
        variant: "destructive",
      })
      
      // Set empty states on error
      setUserStats({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        upcomingDeadlines: [],
        completionRate: 0,
      })
      setUserTasks([])
      setSubmissions([])
      setRecentReviews([])
      setHasNewReviews(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDashboardData()
    const intervalId = setInterval(fetchUserDashboardData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [user, toast])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
      case "Pending":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400 dark:hover:bg-gray-500/30"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30"
      case "Low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400 dark:hover:bg-gray-500/30"
    }
  }

  const getSubmissionStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> Approved
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending Review
          </Badge>
        )
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const maxPage = Math.ceil(userTasks.length / TASKS_PER_PAGE) - 1
      return Math.min(prev + 1, maxPage)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        {/* Space Background */}
        <div className="fixed inset-0 z-0">
          <SpaceParticles />
          <CosmicOrbs />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4 bg-white/10 border border-blue-300/30 backdrop-blur-sm rounded-lg p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <p className="text-lg text-blue-100">Initializing Dashboard...</p>
            <p className="text-sm text-blue-200/70">Loading your data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardProvider
      recentReviews={recentReviews}
      hasNewReviews={hasNewReviews}
      markReviewsAsSeen={markReviewsAsSeen}
    >
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        {/* Space Background */}
        <div className="fixed inset-0 z-0">
          <SpaceParticles />
          <CosmicOrbs />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-3">
                <Rocket className="h-8 w-8 text-blue-400" />
                Dashboard
              </h1>
              <p className="text-lg text-blue-200/80 mt-2">Welcome back, Commander {user?.name || "Agent"}! Here's your overview.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchUserDashboardData}
                className="bg-white/10 border-blue-300/30 text-blue-100 hover:bg-blue-400/20 backdrop-blur-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Status
              </Button>
            </div>
          </div>

          {hasNewReviews && (
            <Alert className="bg-cyan-400/20 border-cyan-300/30 backdrop-blur-sm">
              <Bell className="h-4 w-4 text-cyan-300" />
              <AlertTitle className="text-cyan-100">New Reviews Available</AlertTitle>
              <AlertDescription className="text-cyan-200/80">
                You have {recentReviews.length} submission review{recentReviews.length !== 1 ? "s" : ""} from reviewers. Check
                the "My Submissions" tab for details.
                <Button
                  variant="link"
                  className="text-cyan-200 hover:text-cyan-100 p-0 h-auto font-normal ml-2"
                  onClick={markReviewsAsSeen}
                >
                  Mark as processed
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Active Tasks</CardTitle>
                <div className="h-4 w-4 text-blue-300">
                  <Target className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userStats.totalTasks}</div>
                <p className="text-xs text-blue-200/60">Total assigned tasks</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-green-300/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
                <div className="h-4 w-4 text-green-300">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userStats.completedTasks}</div>
                <p className="text-xs text-green-200/60">{userStats.completionRate}% success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-amber-300/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-100">In Progress</CardTitle>
                <div className="h-4 w-4 text-amber-300">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userStats.inProgressTasks}</div>
                <p className="text-xs text-amber-200/60">Tasks in progress</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-purple-300/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Awaiting</CardTitle>
                <div className="h-4 w-4 text-purple-300">
                  <Clock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userStats.pendingTasks}</div>
                <p className="text-xs text-purple-200/60">Tasks pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Work Hours Manager */}
          <div className="bg-white/10 border-blue-300/30 backdrop-blur-sm rounded-lg p-1">
            <WorkHoursManager />
          </div>

          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto bg-white/10 backdrop-blur-sm border-blue-300/30">
              <TabsTrigger 
                value="tasks" 
                className="data-[state=active]:bg-blue-400/30 data-[state=active]:text-blue-100 text-blue-200/70"
              >
                My Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="submissions" 
                className="relative data-[state=active]:bg-blue-400/30 data-[state=active]:text-blue-100 text-blue-200/70"
              >
                My Submissions
                {hasNewReviews && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-white/10 border-blue-300/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-100 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-300" />
                      Active Tasks
                    </CardTitle>
                    <CardDescription className="text-blue-200/70">View and manage your assigned tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userTasks?.length === 0 ? (
                      <div className="text-center py-8 text-blue-200/70">
                        <Target className="mx-auto h-12 w-12 text-blue-300/60 mb-4" />
                        <p>No active tasks assigned yet.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 bg-blue-400/20 border-blue-300/30 text-blue-100 hover:bg-blue-400/30" 
                          onClick={() => setIsCreateTaskOpen(true)}
                        >
                          Request Task Assignment
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="overflow-x-auto scrollbar-hide">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-blue-300/20 hover:bg-blue-400/10">
                                <TableHead className="text-blue-200">Task</TableHead>
                                <TableHead className="text-blue-200">Status</TableHead>
                                <TableHead className="text-blue-200">Priority</TableHead>
                                <TableHead className="text-blue-200">Deadline</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userTasks
                                .slice(currentPage * TASKS_PER_PAGE, (currentPage + 1) * TASKS_PER_PAGE)
                                .map((task) => (
                                  <TableRow
                                    key={task._id}
                                    className="cursor-pointer hover:bg-blue-400/20 border-blue-300/20 transition-all duration-200"
                                    onClick={() => navigate(`/tasks/${task._id}`)}
                                  >
                                    <TableCell className="font-medium text-blue-100">{task.title}</TableCell>
                                    <TableCell>
                                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                    </TableCell>
                                    <TableCell className="text-blue-200/80">
                                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                        {userTasks.length > TASKS_PER_PAGE && (
                          <div className="flex justify-between mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handlePrevPage} 
                              disabled={currentPage === 0}
                              className="bg-blue-400/20 border-blue-300/30 text-blue-100 hover:bg-blue-400/30 disabled:opacity-50"
                            >
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleNextPage}
                              disabled={(currentPage + 1) * TASKS_PER_PAGE >= userTasks.length}
                              className="bg-blue-400/20 border-blue-300/30 text-blue-100 hover:bg-blue-400/30 disabled:opacity-50"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>

                <Card className="bg-white/10 border-amber-300/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-amber-100 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-amber-300" />
                      Upcoming Deadlines
                    </CardTitle>
                    <CardDescription className="text-amber-200/70">Tasks requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userStats.upcomingDeadlines && userStats.upcomingDeadlines.length > 0 ? (
                      <div className="space-y-4">
                        {userStats.upcomingDeadlines.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-3 rounded-md bg-amber-400/10 border border-amber-300/20 cursor-pointer hover:bg-amber-400/20 transition-all duration-200"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <div>
                              <p className="font-medium text-sm text-amber-100">{task.title}</p>
                              <p className="text-xs text-amber-200/70">
                                Deadline: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-amber-200/70">
                        <Calendar className="mx-auto h-8 w-8 text-amber-300/60 mb-2" />
                        <p>No critical deadlines</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>

              <Card className="mt-6 bg-white/10 border-green-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-300" />
                    Task Progress Analytics
                  </CardTitle>
                  <CardDescription className="text-green-200/70">Comprehensive view of your task completion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Progress */}
                    <div className="bg-green-400/10 border border-green-300/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-300" />
                            <p className="text-sm font-medium text-green-100">Overall Completion</p>
                          </div>
                          <p className="text-xs text-green-200/70">
                            {userStats.completedTasks} of {userStats.totalTasks} tasks completed
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-100">{userStats.completionRate}%</span>
                          <p className="text-xs text-green-200/70">Success Rate</p>
                        </div>
                      </div>
                      <Progress 
                        value={userStats.completionRate} 
                        className="h-4 bg-green-900/30 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-emerald-400 [&>div]:shadow-lg [&>div]:shadow-green-400/25" 
                      />
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Completed Tasks */}
                      <div className="bg-emerald-400/10 border border-emerald-300/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-300" />
                          <span className="text-sm font-medium text-emerald-100">Completed</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{userStats.completedTasks}</span>
                            <span className="text-xs text-emerald-200/70">tasks</span>
                          </div>
                          <Progress 
                            value={userStats.totalTasks > 0 ? (userStats.completedTasks / userStats.totalTasks) * 100 : 0} 
                            className="h-2 bg-emerald-900/30 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-green-500" 
                          />
                        </div>
                      </div>

                      {/* In Progress Tasks */}
                      <div className="bg-amber-400/10 border border-amber-300/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-amber-300" />
                          <span className="text-sm font-medium text-amber-100">In Progress</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{userStats.inProgressTasks}</span>
                            <span className="text-xs text-amber-200/70">active</span>
                          </div>
                          <Progress 
                            value={userStats.totalTasks > 0 ? (userStats.inProgressTasks / userStats.totalTasks) * 100 : 0} 
                            className="h-2 bg-amber-900/30 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-orange-500" 
                          />
                        </div>
                      </div>

                      {/* Pending Tasks */}
                      <div className="bg-purple-400/10 border border-purple-300/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-300" />
                          <span className="text-sm font-medium text-purple-100">Pending</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{userStats.pendingTasks}</span>
                            <span className="text-xs text-purple-200/70">waiting</span>
                          </div>
                          <Progress 
                            value={userStats.totalTasks > 0 ? (userStats.pendingTasks / userStats.totalTasks) * 100 : 0} 
                            className="h-2 bg-purple-900/30 [&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-indigo-500" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Progress Insights */}
                    <div className="bg-blue-400/10 border border-blue-300/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-blue-300" />
                        <span className="text-sm font-medium text-blue-100">Progress Insights</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-white">{userStats.totalTasks}</div>
                          <div className="text-xs text-blue-200/70">Total Tasks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-300">
                            {userStats.totalTasks > 0 ? Math.round((userStats.completedTasks / userStats.totalTasks) * 100) : 0}%
                          </div>
                          <div className="text-xs text-blue-200/70">Complete</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-amber-300">
                            {userStats.totalTasks > 0 ? Math.round((userStats.inProgressTasks / userStats.totalTasks) * 100) : 0}%
                          </div>
                          <div className="text-xs text-blue-200/70">Active</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-300">
                            {userStats.totalTasks > 0 ? Math.round((userStats.pendingTasks / userStats.totalTasks) * 100) : 0}%
                          </div>
                          <div className="text-xs text-blue-200/70">Pending</div>
                        </div>
                      </div>
                    </div>

                    {/* Productivity Meter */}
                    {userStats.completedTasks > 0 && (
                      <div className="bg-cyan-400/10 border border-cyan-300/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Rocket className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm font-medium text-cyan-100">Productivity Level</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-cyan-200/80">
                            {userStats.completionRate >= 80 ? "Excellent!" : 
                             userStats.completionRate >= 60 ? "Good Progress" : 
                             userStats.completionRate >= 40 ? "Keep Going" : "Getting Started"}
                          </span>
                          <span className="text-cyan-100 font-medium">{userStats.completionRate}%</span>
                        </div>
                        <Progress 
                          value={userStats.completionRate} 
                          className="h-3 bg-cyan-900/30 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-blue-400 [&>div]:to-purple-400 [&>div]:shadow-lg [&>div]:shadow-cyan-400/25" 
                        />
                        <p className="text-xs text-cyan-200/60 mt-2">
                          {userStats.completionRate >= 80 ? "🚀 You're crushing your goals!" : 
                           userStats.completionRate >= 60 ? "📈 Solid performance!" : 
                           userStats.completionRate >= 40 ? "⚡ Building momentum!" : "🎯 Every task matters!"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

            <TabsContent value="submissions" className="mt-6">
              <Card className="bg-white/10 border-purple-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Github className="h-5 w-5 text-purple-300" />
                    Submissions
                  </CardTitle>
                  <CardDescription className="text-purple-200/70">Track the status of your task submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 text-purple-200/70">
                      <Github className="mx-auto h-8 w-8 text-purple-300/60 mb-2" />
                      <p>No task submissions yet.</p>
                      <p className="text-sm mt-1">Complete a task and submit it to see reports here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-300/20 hover:bg-purple-400/10">
                            <TableHead className="text-purple-200">Task</TableHead>
                            <TableHead className="text-purple-200">Submitted On</TableHead>
                            <TableHead className="text-purple-200">Status</TableHead>
                            <TableHead className="text-purple-200">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submissions.map((submission) => (
                            <TableRow key={submission._id} className="hover:bg-purple-400/20 border-purple-300/20 transition-all duration-200">
                              <TableCell className="font-medium text-purple-100">{submission.task?.title || "Unknown Task"}</TableCell>
                              <TableCell className="text-purple-200/80">{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{getSubmissionStatusBadge(submission.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewSubmission(submission)
                                    }}
                                    className="bg-purple-400/20 border-purple-300/30 text-purple-100 hover:bg-purple-400/30"
                                  >
                                    View
                                  </Button>
                                  {submission.status === "Rejected" && (
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedSubmission(submission)
                                        setIsRevisionDialogOpen(true)
                                      }}
                                      className="bg-orange-400/20 border-orange-300/30 text-orange-100 hover:bg-orange-400/30"
                                    >
                                      Submit Revision
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {recentReviews.length > 0 && (
                <Card className="mt-6 bg-white/10 border-cyan-300/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-100 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-cyan-300" />
                      Command Feedback
                    </CardTitle>
                    <CardDescription className="text-cyan-200/70">Recent evaluations from mission control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <SubmissionFeedbackCard
                          key={review._id}
                          submission={review}
                          onViewDetails={(submission) => {
                            setSelectedSubmission(submission)
                            setIsSubmissionDetailsOpen(true)
                          }}
                          onSubmitRevision={(submission) => {
                            setSelectedSubmission(submission)
                            setIsRevisionDialogOpen(true)
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        </Tabs>

           <Dialog open={isSubmissionDetailsOpen} onOpenChange={setIsSubmissionDetailsOpen} className="dialog-overlay">
            <DialogContent className="dialog-content sm:max-w-[525px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border-blue-300/30 backdrop-blur-sm">
            
              <DialogHeader>
                <DialogTitle className="text-blue-100 flex items-center gap-2">
                  <Github className="h-5 w-5 text-blue-300" />
                  Submission Details
                </DialogTitle>
                <DialogDescription className="text-blue-200/70">{selectedSubmission?.task?.title || "Task Submission"}</DialogDescription>
              </DialogHeader>

              {selectedSubmission && (
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-blue-100">Status:</p>
                      {getSubmissionStatusBadge(selectedSubmission.status)}
                    </div>
                    <p className="text-sm text-blue-200/70">
                      Submitted on {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-100">GitHub Repository:</p>
                    <div className="flex items-center gap-2 bg-white/10 border border-blue-300/30 p-2 rounded">
                      <Github className="h-4 w-4 text-blue-300" />
                      <a
                        href={selectedSubmission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1"
                      >
                        {selectedSubmission.githubLink}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {selectedSubmission.additionalLinks && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-100">Additional Links:</p>
                      <div className="flex items-center gap-2 bg-white/10 border border-blue-300/30 p-2 rounded">
                        <ExternalLink className="h-4 w-4 text-blue-300" />
                        <a
                          href={selectedSubmission.additionalLinks}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1"
                        >
                          {selectedSubmission.additionalLinks}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedSubmission.notes && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-100">Your Notes:</p>
                      <div className="bg-white/10 border border-blue-300/30 p-3 rounded">
                        <p className="text-sm whitespace-pre-line text-blue-200/90">{selectedSubmission.notes}</p>
                      </div>
                    </div>
                  )}

                  {selectedSubmission.feedback && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-100">Reviewer Feedback:</p>
                      <div
                        className={`p-3 rounded border ${
                          selectedSubmission.status === "Approved"
                            ? "bg-green-400/20 border-green-300/30"
                            : "bg-red-400/20 border-red-300/30"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line text-white/90">{selectedSubmission.feedback}</p>
                      </div>
                    </div>
                  )}
              </div>
            )}

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmissionDetailsOpen(false)}
                  className="bg-white/10 border-blue-300/30 text-blue-100 hover:bg-blue-400/20"
                >
                  Close
                </Button>
                {selectedSubmission?.status === "Rejected" && (
                  <Button
                    onClick={() => {
                      setIsSubmissionDetailsOpen(false)
                      setIsRevisionDialogOpen(true)
                    }}
                    className="bg-orange-400/20 border-orange-300/30 text-orange-100 hover:bg-orange-400/30"
                  >
                    Submit Revision
                  </Button>
                )}
                {selectedSubmission?.task && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmissionDetailsOpen(false)
                      navigate(`/tasks/${selectedSubmission.task._id}`)
                    }}
                    className="bg-purple-400/20 border-purple-300/30 text-purple-100 hover:bg-purple-400/30"
                  >
                    View Task
                  </Button>
                )}
              </DialogFooter>
          </DialogContent>
        </Dialog>

          <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
            <DialogContent className="sm:max-w-[525px] bg-slate-900/95 border-orange-300/30 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-orange-100 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-300" />
                  Submit Revision
                </DialogTitle>
                <DialogDescription className="text-orange-200/70">Update your submission based on reviewer feedback</DialogDescription>
              </DialogHeader>

              {selectedSubmission && (
                <div className="space-y-4 py-4">
                  {selectedSubmission.feedback && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-100">Reviewer Feedback:</p>
                      <div className="bg-red-400/20 border border-red-300/30 p-3 rounded">
                        <p className="text-sm whitespace-pre-line text-red-100">{selectedSubmission.feedback}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-100">Your Original Submission:</p>
                    <div className="flex items-center gap-2 bg-white/10 border border-orange-300/30 p-2 rounded">
                      <Github className="h-4 w-4 text-orange-300" />
                      <a
                        href={selectedSubmission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1"
                      >
                        {selectedSubmission.githubLink}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-100">Revision Notes:</p>
                    <Textarea
                      placeholder="Describe the changes you've made in response to the feedback..."
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      rows={4}
                      className="bg-white/10 border-orange-300/30 text-orange-100 placeholder:text-orange-200/50 focus:border-orange-300/50"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRevisionDialogOpen(false)}
                  className="bg-white/10 border-orange-300/30 text-orange-100 hover:bg-orange-400/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitRevision} 
                  disabled={!revisionNotes.trim() || isLoading}
                  className="bg-orange-400/20 border-orange-300/30 text-orange-100 hover:bg-orange-400/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Revision"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardProvider>
  )
}

export default UserDashboard