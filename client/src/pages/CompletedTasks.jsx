

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/use-toast"
import { Check, Clock, Filter, Github, Link2, Loader2, ThumbsDown, ThumbsUp, Search, AlertTriangle, ExternalLink, CheckCircle, XCircle, HelpCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { CompletedTasksStats } from "../components/dashboard/CompletedTasksStats"
import { SpaceParticles, CosmicOrbs } from "../components/ui/space-particles"
import { API_URL } from "@/lib/api"

const CompletedTasks = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    status: "Approved",
    feedback: "",
  })
  const [viewMode, setViewMode] = useState("grid")
  const [submissionFilter, setSubmissionFilter] = useState("all")
  const [showStats, setShowStats] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("WorkflowToken")

      const tasksResponse = await axios.get(`${API_URL}/tasks?status=Completed`, {
        headers: { "x-auth-token": token },
      })
      setTasks(tasksResponse.data)

      const submissionsResponse = await axios.get(`${API_URL}/submissions`, {
        headers: { "x-auth-token": token },
      })
      setSubmissions(submissionsResponse.data)

      const departmentsResponse = await axios.get(`${API_URL}/departments`, {
        headers: { "x-auth-token": token },
      })

      console.log('CompletedTasks - Departments response:', departmentsResponse.data)

      // Handle both old and new response formats
      if (departmentsResponse.data.success && departmentsResponse.data.data) {
        setDepartments(departmentsResponse.data.data)
      } else if (Array.isArray(departmentsResponse.data)) {
        setDepartments(departmentsResponse.data)
      } else {
        console.error('Unexpected departments response format:', departmentsResponse.data)
        setDepartments([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

const handleReviewSubmission = async () => {
  if (!selectedSubmission) return

  try {
    setIsLoading(true)
    const token = localStorage.getItem("WorkflowToken")
    const reviewerId = JSON.parse(localStorage.getItem("WorkflowUser")).id // Assuming userId is stored as a string in localStorage

    if (!reviewerId) {
      throw new Error("Reviewer ID not found")
    }

    // Validate that reviewerId is a string and not an object
    const updatedReviewData = {
      status: reviewData.status,
      feedback: reviewData.feedback,
      reviewedBy: typeof reviewerId === "string" ? reviewerId : reviewerId.id, // Ensure only the ID string is sent
    }

    await axios.put(
      `${API_URL}/submissions/${selectedSubmission._id}/review`,
      updatedReviewData,
      { headers: { "x-auth-token": token } }
    )

    toast({
      title: "Success",
      description: `Submission ${reviewData.status.toLowerCase()} successfully`,
    })

    setReviewDialogOpen(false)
    setReviewData({ status: "Approved", feedback: "" })
    fetchData()
  } catch (error) {
    console.error("Error reviewing submission:", error)
    toast({
      title: "Error",
      description: "Failed to review submission",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

  const getSubmissionForTask = (taskId) => {
    return submissions.find((submission) => submission.task?._id === taskId)
  }

  const getSubmissionStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/70 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/70 flex items-center gap-1">
            <HelpCircle className="h-3 w-3" /> Pending Review
          </Badge>
        )
    }
  }

  const getDocumentDetails = (documentLink, fileType) => {
    if (!documentLink) return { url: null, fileName: null, fileType: null }
    const fileName = documentLink.split("/").pop() || "Document"
    const url = documentLink
    const fileTypeMap = {
      "application/pdf": "PDF Document",
      "application/msword": "Word Document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document",
      "image/png": "PNG Image",
      "image/jpeg": "JPEG Image",
    }
    const displayFileType = fileTypeMap[fileType] || "Document"
    const isPDF = fileType === "application/pdf"
    const isImage = fileType.startsWith("image/")
    const displayUrl = isPDF ? `${url}?_a=BAE6pY0` : url
    return { url: displayUrl, fileName, fileType: displayFileType, isImage }
  }

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignee?.name && task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDepartment = selectedDepartment === "all" || task.department?._id === selectedDepartment

      const submission = getSubmissionForTask(task._id)
      let matchesSubmission = true
      if (submissionFilter === "pending") {
        matchesSubmission = submission && submission.status === "Pending"
      } else if (submissionFilter === "approved") {
        matchesSubmission = submission && submission.status === "Approved"
      } else if (submissionFilter === "rejected") {
        matchesSubmission = submission && submission.status === "Rejected"
      } else if (submissionFilter === "noSubmission") {
        matchesSubmission = !submission
      }

      return matchesSearch && matchesDepartment && matchesSubmission
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading completed tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      {/* LAYER 1: Space Particles */}
      <div className="absolute inset-0 opacity-30">
        <SpaceParticles count={60} className="opacity-40" />
      </div>
      
      <div className="absolute inset-0 opacity-20">
        <CosmicOrbs count={8} className="opacity-25" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* LAYER 2: Main Content */}
      <div className="relative z-10 h-screen flex flex-col space-y-6 overflow-y-auto scrollbar-none px-4 md:px-6 py-6">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Completed Tasks</h1>
            <p className="text-white/70 text-lg">Review and manage task submissions across the universe</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData} 
              className="h-9 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-300 hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <Clock className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? "Hide Analytics" : "Show Analytics"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 text-cyan-300 hover:from-cyan-500/20 hover:to-cyan-600/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <Filter className="mr-2 h-4 w-4" /> Display Mode
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800/90 backdrop-blur-md border-slate-600/50">
                <DropdownMenuItem onClick={() => setViewMode("grid")} className="text-white hover:bg-blue-500/20">Grid View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("list")} className="text-white hover:bg-blue-500/20">List View</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      {showStats && (
        <div className="mb-6">
          <CompletedTasksStats />
        </div>
      )}

        {/* Enhanced Filter Controls */}
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400/70" />
              <Input
                placeholder="Search across the task galaxy..."
                className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-[220px] bg-slate-800/50 border-slate-600/50 text-white">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/90 backdrop-blur-md border-slate-600/50">
                <SelectItem value="all" className="text-white hover:bg-blue-500/20">All Departments</SelectItem>
                {Array.isArray(departments) && departments.map((department) => (
                  <SelectItem key={department._id} value={department._id} className="text-white hover:bg-blue-500/20">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${department.color}`}></div>
                      {department.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
              <SelectTrigger className="w-full md:w-[220px] bg-slate-800/50 border-slate-600/50 text-white">
                <SelectValue placeholder="Filter by submission" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/90 backdrop-blur-md border-slate-600/50">
                <SelectItem value="all" className="text-white hover:bg-blue-500/20">All Submissions</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-blue-500/20">Pending Review</SelectItem>
                <SelectItem value="approved" className="text-white hover:bg-blue-500/20">Approved</SelectItem>
                <SelectItem value="rejected" className="text-white hover:bg-blue-500/20">Rejected</SelectItem>
                <SelectItem value="noSubmission" className="text-white hover:bg-blue-500/20">No Submission</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs defaultValue="tasks" className="w-full flex-1">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8 bg-slate-800/50 border border-slate-600/30">
            <TabsTrigger 
              value="tasks" 
              className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-blue-300 text-white/70"
            >
              <Check className="mr-2 h-4 w-4" /> Task Galaxy
            </TabsTrigger>
            <TabsTrigger 
              value="submissions" 
              className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-purple-300 text-white/70"
            >
              <Github className="mr-2 h-4 w-4" /> Submission Hub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-0">
            {filteredTasks.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-orange-500/20 backdrop-blur-md shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                      <Check className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Completed Tasks Found</h3>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    No completed tasks match your current filter criteria. Try adjusting your search parameters or check back later.
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => {
                  const submission = getSubmissionForTask(task._id)
                  const document = submission ? getDocumentDetails(submission.documentLink, submission.fileType) : null
                  return (
                    <Card
                      key={task._id}
                      className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl hover:from-slate-800/40 hover:to-slate-900/60 hover:border-blue-400/30 transition-all duration-300 overflow-hidden group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg text-white line-clamp-1 group-hover:text-blue-300 transition-colors duration-300">{task.title}</CardTitle>
                          {task.department && (
                            <Badge
                              variant="outline"
                              className="border-none bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center gap-1.5"
                            >
                              <div className={`w-2 h-2 rounded-full ${task.department.color}`}></div>
                              <span className="text-xs font-medium">{task.department.name}</span>
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 mt-1 text-white/60">{task.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        {submission ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium text-white/80">Mission Status</h4>
                              {getSubmissionStatusBadge(submission.status)}
                            </div>
                            <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-lg p-3 space-y-2 backdrop-blur-sm">
                            {submission.githubLink && (
                              <div className="flex items-center gap-2 text-sm">
                                <Github className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={submission.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center gap-1"
                                >
                                  {submission.githubLink.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {submission.additionalLinks && (
                              <div className="flex items-center gap-2 text-sm">
                                <Link2 className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={submission.additionalLinks}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center gap-1"
                                >
                                  {new URL(submission.additionalLinks).hostname}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {document?.url && (
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={document.url}
                                  target={document.isImage ? "_self" : "_blank"}
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center gap-1"
                                >
                                  {document.fileName} ({document.fileType})
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {submission.notes && (
                              <div className="pt-1 text-sm">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                                <p className="line-clamp-2">{submission.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4 text-muted-foreground">
                          <p>No submission yet</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/tasks/${task._id}`)} className="h-8">
                          View Details
                        </Button>
                        {submission && (
                          <Button
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setSelectedSubmission(submission)
                              setReviewData({ status: submission.status || "Approved", feedback: submission.feedback || "" })
                              setReviewDialogOpen(true)
                            }}
                          >
                            {submission.status === "Pending" ? "Review" : "Re-review"}
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Task</th>
                        <th className="text-left p-4 font-medium">Assignee</th>
                        <th className="text-left p-4 font-medium">Department</th>
                        <th className="text-left p-4 font-medium">Submission</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => {
                        const submission = getSubmissionForTask(task._id)
                        const document = submission ? getDocumentDetails(submission.documentLink, submission.fileType) : null
                        return (
                          <tr key={task._id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4">
                              {task.assignee ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {task.assignee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{task.assignee.name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Unassigned</span>
                              )}
                            </td>
                            <td className="p-4">
                              {task.department ? (
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${task.department.color}`}></div>
                                  <span>{task.department.name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </td>
                            <td className="p-4">
                              {submission ? (
                                <div className="space-y-2">
                                  {submission.githubLink && (
                                    <div className="flex items-center gap-2">
                                      <Github className="h-4 w-4" />
                                      <a
                                        href={submission.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] flex items-center gap-1"
                                      >
                                        {submission.githubLink.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  )}
                                  {document?.url && (
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      <a
                                        href={document.url}
                                        target={document.isImage ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] flex items-center gap-1"
                                      >
                                        {document.fileName} ({document.fileType})
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No submission</span>
                              )}
                            </td>
                            <td className="p-4">
                              {submission ? getSubmissionStatusBadge(submission.status) : <span>—</span>}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/tasks/${task._id}`)}
                                  className="h-8"
                                >
                                  View
                                </Button>
                                {submission && (
                                  <Button
                                    size="sm"
                                    className="h-8"
                                    onClick={() => {
                                      setSelectedSubmission(submission)
                                      setReviewData({ status: submission.status || "Approved", feedback: submission.feedback || "" })
                                      setReviewDialogOpen(true)
                                    }}
                                  >
                                    {submission.status === "Pending" ? "Review" : "Re-review"}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Task Submissions</CardTitle>
              <CardDescription>All submissions for completed tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Task</th>
                      <th className="text-left p-4 font-medium">Submitted By</th>
                      <th className="text-left p-4 font-medium">Submission Details</th>
                      <th className="text-left p-4 font-medium">Submitted On</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions
                      .filter((submission) => {
                        if (selectedDepartment !== "all") {
                          const task = tasks.find((t) => t._id === submission.task?._id)
                          if (!task || task.department?._id !== selectedDepartment) {
                            return false
                          }
                        }
                        if (submissionFilter !== "all") {
                          if (submissionFilter === "pending" && submission.status !== "Pending") {
                            return false
                          } else if (submissionFilter === "approved" && submission.status !== "Approved") {
                            return false
                          } else if (submissionFilter === "rejected" && submission.status !== "Rejected") {
                            return false
                          }
                        }
                        return true
                      })
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((submission) => {
                        const task = tasks.find((t) => t._id === submission.task?._id)
                        const document = getDocumentDetails(submission.documentLink, submission.fileType)
                        return (
                          <tr key={submission._id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              {task ? (
                                <div className="font-medium">{task.title}</div>
                              ) : (
                                <span className="text-muted-foreground">Unknown Task</span>
                              )}
                            </td>
                            <td className="p-4">
                              {submission.user ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={submission.user.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {submission.user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{submission.user.name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Unknown User</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="space-y-2">
                                {submission.githubLink && (
                                  <div className="flex items-center gap-2">
                                    <Github className="h-4 w-4" />
                                    <a
                                      href={submission.githubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] flex items-center gap-1"
                                    >
                                      {submission.githubLink.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                                {document?.url && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <a
                                      href={document.url}
                                      target={document.isImage ? "_self" : "_blank"}
                                      rel="noopener noreferrer"
                                      className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] flex items-center gap-1"
                                    >
                                      {document.fileName} ({document.fileType})
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                                {submission.notes && (
                                  <div className="pt-1 text-sm">
                                    <p className="text-xs font-medium text-muted-foreground">Notes:</p>
                                    <p className="line-clamp-2">{submission.notes}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              {getSubmissionStatusBadge(submission.status)}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                {task && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/tasks/${task._id}`)}
                                    className="h-8"
                                  >
                                    View Task
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="h-8"
                                  onClick={() => {
                                    setSelectedSubmission(submission)
                                    setReviewData({ status: submission.status || "Approved", feedback: submission.feedback || "" })
                                    setReviewDialogOpen(true)
                                  }}
                                >
                                  {submission.status === "Pending" ? "Review" : "Re-review"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen} className="dialog-overlay">
        <DialogContent className="dialog-content sm:max-w-[525px] max-w-full sm:max-w-[525px] w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.status === "Pending" ? "Review Task Submission" : "Re-review Task Submission"}</DialogTitle>
            <DialogDescription>Review or update the feedback for this task submission.</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Task Information</h3>
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-medium">{selectedSubmission.task?.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {selectedSubmission.task?.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Submission Details</h3>
                  <div className="space-y-3">
                    {selectedSubmission.githubLink && (
                      <div className="flex flex-wrap items-center gap-2 break-all">
                        <Github className="h-4 w-4" />
                        <a
                          href={selectedSubmission.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {selectedSubmission.githubLink}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedSubmission.additionalLinks && (
                      <div className="flex flex-wrap items-center gap-2 break-all">
                        <Link2 className="h-4 w-4" />
                        <a
                          href={selectedSubmission.additionalLinks}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {selectedSubmission.additionalLinks}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedSubmission.documentLink && (
                      <div className="flex flex-wrap items-center gap-2 break-all">
                        <FileText className="h-4 w-4" />
                        <a
                          href={getDocumentDetails(selectedSubmission.documentLink, selectedSubmission.fileType).url}
                          target={getDocumentDetails(selectedSubmission.documentLink, selectedSubmission.fileType).isImage ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {getDocumentDetails(selectedSubmission.documentLink, selectedSubmission.fileType).fileName} ({getDocumentDetails(selectedSubmission.documentLink, selectedSubmission.fileType).fileType})
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedSubmission.notes && (
                      <div className="bg-muted p-3 rounded-lg mt-2">
                        <h4 className="text-sm font-medium mb-1">Notes from Submitter:</h4>
                        <p className="text-sm whitespace-pre-line">{selectedSubmission.notes}</p>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Submitted on {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {selectedSubmission.reviewHistory && selectedSubmission.reviewHistory.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Review History</h3>
                    <div className="space-y-3">
                      {selectedSubmission.reviewHistory.map((review, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{review.status}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.reviewedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">By: {review.reviewedBy?.name || "Unknown"}</p>
                          {review.feedback && (
                            <p className="text-sm mt-1">Feedback: {review.feedback}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="review-status">Review Decision</Label>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Button
                      type="button"
                      variant={reviewData.status === "Approved" ? "default" : "outline"}
                      className={
                        reviewData.status === "Approved"
                          ? "flex-1 bg-green-600 hover:bg-green-700"
                          : "flex-1 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                      }
                      onClick={() => setReviewData({ ...reviewData, status: "Approved" })}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      type="button"
                      variant={reviewData.status === "Rejected" ? "default" : "outline"}
                      className={
                        reviewData.status === "Rejected"
                          ? "flex-1 bg-red-600 hover:bg-red-700"
                          : "flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                      }
                      onClick={() => setReviewData({ ...reviewData, status: "Rejected" })}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide feedback to the submitter..."
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmission} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>Submit Review</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export default CompletedTasks
