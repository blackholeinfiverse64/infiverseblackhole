"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash, Loader2, Target, AlertCircle, Users } from 'lucide-react'
import { TaskDetailsDialog } from "./task-details-dialog"
import { useToast } from "../../hooks/use-toast"
import { api } from "../../lib/api"
import { useSocketContext } from "../../context/socket-context"

export function TasksList({ filters = {}, searchQuery = "", viewMode = "table" }) {
  const { toast } = useToast()
  const { events } = useSocketContext() || { events: {} }
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch tasks based on filters
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Fetching tasks with filters:', filters)
        
        const data = await api.tasks.getTasks(filters)
        console.log('Tasks data received:', data)
        
        // Handle different response formats
        const tasksArray = Array.isArray(data) ? data : (data.data || data.tasks || [])
        setTasks(tasksArray)
        
        console.log('Tasks set in state:', tasksArray)
      } catch (err) {
        console.error('Error fetching tasks:', err)
        setError(err.message || "Failed to load tasks")
        toast({
          title: "Error",
          description: err.message || "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [filters, toast])

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks

    return tasks.filter(task => {
      const searchLower = searchQuery.toLowerCase()
      return (
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignee?.name?.toLowerCase().includes(searchLower) ||
        task.assignee?.department?.name?.toLowerCase().includes(searchLower) ||
        task.status?.toLowerCase().includes(searchLower) ||
        task.priority?.toLowerCase().includes(searchLower)
      )
    })
  }, [tasks, searchQuery])

  // Group tasks by department for display
  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      const deptName = task.assignee?.department?.name || "Unassigned"
      if (!acc[deptName]) {
        acc[deptName] = []
      }
      acc[deptName].push(task)
      return acc
    }, {})
  }, [filteredTasks])

  // Handle real-time updates
  useEffect(() => {
    if (events && (events.taskCreated || events.taskUpdated || events.taskDeleted)) {
      // Refetch tasks when events occur
      const fetchTasks = async () => {
        try {
          console.log('Refetching tasks due to real-time event')
          const data = await api.tasks.getTasks(filters)
          const tasksArray = Array.isArray(data) ? data : (data.data || data.tasks || [])
          setTasks(tasksArray)
        } catch (error) {
          console.error("Error refetching tasks:", error)
        }
      }
      fetchTasks()
    }
  }, [events, filters])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Pending":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleViewTask = (task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      setIsDeleting(true)
      await api.tasks.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task._id !== taskId))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Card View Component
  const TaskCard = ({ task }) => (
    <Card className="glass-card border border-white/10 bg-background/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                {task.title}
              </h3>
              <p className="text-sm text-white/60 mt-1 line-clamp-2">
                {task.description || "No description provided"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/70 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border border-primary/20 bg-background/90 backdrop-blur-md">
                <DropdownMenuItem onClick={() => handleViewTask(task)} className="text-white hover:bg-primary/10">
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-400 hover:bg-red-500/10"
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          {/* Assignee and Due Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {task.assignee?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span>{task.assignee?.name || "Unassigned"}</span>
            </div>
            <div className="text-white/60">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="text-xs text-white/50 p-2 bg-black/20 rounded">
        Debug: Loading: {isLoading.toString()}, Error: {error || 'none'}, Tasks: {tasks.length}, Filtered: {filteredTasks.length}, Groups: {Object.keys(groupedTasks).length}
      </div>
      
      {/* Tasks Display */}
      {isLoading ? (
        <Card className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
          <CardContent className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 animate-ping" />
              </div>
              <p className="text-white/80">Loading tasks...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="glass-card border border-destructive/20 bg-background/10 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <div className="text-destructive mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading tasks</p>
              <p className="text-sm text-white/60">{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-primary/30 text-white hover:bg-primary/10"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : Object.keys(groupedTasks).length === 0 ? (
        <Card className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-white/60 mb-2">
              {searchQuery ? "No tasks found matching your search criteria" : "No tasks found matching the selected filters"}
            </p>
            <p className="text-xs text-white/40">
              {searchQuery ? "Try adjusting your search terms" : "Try changing your filter settings"}
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTasks).map(([deptName, deptTasks]) => (
          <Card key={deptName} className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    {deptName} Tasks
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {deptTasks.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Tasks assigned to the {deptName} department
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "cards" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {deptTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/80">Title</TableHead>
                        <TableHead className="text-white/80">Assignee</TableHead>
                        <TableHead className="text-white/80">Status</TableHead>
                        <TableHead className="text-white/80">Priority</TableHead>
                        <TableHead className="text-white/80">Due Date</TableHead>
                        <TableHead className="text-right text-white/80">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deptTasks.map((task) => (
                        <TableRow key={task._id} className="border-white/10 hover:bg-white/5 transition-colors duration-300">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{task.title}</div>
                              {task.description && (
                                <div className="text-sm text-white/60 truncate max-w-xs">
                                  {task.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80">{task.assignee?.name || "Unassigned"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass-card border border-primary/20 bg-background/90 backdrop-blur-md">
                                <DropdownMenuItem onClick={() => handleViewTask(task)} className="text-white hover:bg-primary/10">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTask(task._id)}
                                  className="text-red-400 hover:bg-red-500/10"
                                  disabled={isDeleting}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Dialogs */}
      <TaskDetailsDialog
        task={selectedTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}