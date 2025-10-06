"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Plus, Search, Grid3X3, List, Target, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { CreateTaskDialog } from "./create-task-dialog"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function TasksHeader({ onSearchChange, onViewModeChange, viewMode }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTaskStats()
  }, [])

  const fetchTaskStats = async () => {
    try {
      setIsLoading(true)
      const response = await api.tasks.getTasks()
      const tasks = Array.isArray(response) ? response : response.data || []
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'Completed').length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length,
        pending: tasks.filter(task => task.status === 'Pending').length
      }
      
      setTaskStats(stats)
    } catch (error) {
      console.error("Error fetching task stats:", error)
      toast({
        title: "Error",
        description: "Failed to load task statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Target className="h-8 w-8 text-primary" />
              </div>
              Tasks Management
            </h1>
            <p className="text-lg text-white/70">
              Manage and track tasks across all departments and teams
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-64 pl-10 bg-background/20 border-primary/30 focus:border-gold/50 text-white placeholder:text-white/50"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-background/20 border border-primary/30 p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className={`${viewMode === "table" ? "bg-primary/20 text-white" : "text-white/70 hover:text-white"} transition-all duration-300`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("cards")}
                className={`${viewMode === "cards" ? "bg-primary/20 text-white" : "text-white/70 hover:text-white"} transition-all duration-300`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Create Task Button */}
            <Button 
              onClick={() => setIsCreateTaskOpen(true)}
              className="space-button bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-gold/50 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isLoading ? "..." : taskStats.total}</div>
            <p className="text-xs text-white/60 mt-1">All active tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-success/20 bg-background/10 backdrop-blur-md hover:border-success/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Completed</CardTitle>
            <div className="p-2 rounded-lg bg-success/20 border border-success/30">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isLoading ? "..." : taskStats.completed}</div>
            <p className="text-xs text-white/60 mt-1">
              {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-warning/20 bg-background/10 backdrop-blur-md hover:border-warning/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">In Progress</CardTitle>
            <div className="p-2 rounded-lg bg-warning/20 border border-warning/30">
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isLoading ? "..." : taskStats.inProgress}</div>
            <p className="text-xs text-white/60 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-destructive/20 bg-background/10 backdrop-blur-md hover:border-destructive/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Pending</CardTitle>
            <div className="p-2 rounded-lg bg-destructive/20 border border-destructive/30">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isLoading ? "..." : taskStats.pending}</div>
            <p className="text-xs text-white/60 mt-1">Awaiting start</p>
          </CardContent>
        </Card>
      </div>

      <CreateTaskDialog 
        open={isCreateTaskOpen} 
        onOpenChange={setIsCreateTaskOpen}
        onTaskCreated={fetchTaskStats}
      />
    </div>
  )
}
