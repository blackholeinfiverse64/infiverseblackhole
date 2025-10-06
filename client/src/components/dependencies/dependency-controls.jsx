import React, { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Grid3X3,
  BarChart3,
  GitBranch,
  Users,
  Clock,
  Target
} from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function DependencyControls() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [viewMode, setViewMode] = useState("graph")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [departments, setDepartments] = useState([])
  const [filterStats] = useState({
    total: 0,
    filtered: 0,
    blocked: 0,
    completed: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.departments.getDepartments()
        const departmentsData = response.success ? response.data : response
        setDepartments(Array.isArray(departmentsData) ? departmentsData : [])
      } catch (error) {
        console.error('Error fetching departments:', error)
        toast({
          title: "Error",
          description: "Failed to load departments",
          variant: "destructive"
        })
      }
    }

    fetchDepartments()
  }, [toast])

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50))
  const handleReset = () => {
    setZoomLevel(100)
    setSearchTerm("")
    setSelectedDepartment("All")
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Dependency graph export is being prepared..."
    })
  }

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search */}
        <Card className="lg:col-span-4 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-white focus:border-purple-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Filter */}
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="All" className="bg-slate-800">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name} className="bg-slate-800">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Tabs */}
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex rounded-lg bg-slate-700/50 p-1">
              <Button
                variant={viewMode === "graph" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("graph")}
                className={`flex-1 h-8 ${
                  viewMode === "graph" 
                    ? "bg-purple-500 hover:bg-purple-600 text-white" 
                    : "text-white hover:text-white hover:bg-slate-600"
                }`}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Graph
              </Button>
              <Button
                variant={viewMode === "gantt" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("gantt")}
                className={`flex-1 h-8 ${
                  viewMode === "gantt" 
                    ? "bg-purple-500 hover:bg-purple-600 text-white" 
                    : "text-white hover:text-white hover:bg-slate-600"
                }`}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Gantt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zoom Controls */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="h-8 w-8 p-0 text-white hover:text-white hover:bg-slate-600"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs text-white min-w-fit">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="h-8 w-8 p-0 text-white hover:text-white hover:bg-slate-600"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Statistics */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-white">
            <Target className="h-3 w-3 mr-1" />
            {filterStats.filtered} Tasks
          </Badge>
          <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-white">
            <Clock className="h-3 w-3 mr-1" />
            {filterStats.completed} Completed
          </Badge>
          <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-white">
            <Filter className="h-3 w-3 mr-1" />
            {filterStats.blocked} Blocked
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-slate-700/50 border-slate-600 text-white hover:text-white hover:bg-slate-600"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-slate-700/50 border-slate-600 text-white hover:text-white hover:bg-slate-600"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white mr-2">Quick Filters:</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 bg-purple-500/20 border border-purple-500/30 text-white hover:bg-purple-500/30"
            >
              Critical Path
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 bg-yellow-500/20 border border-yellow-500/30 text-white hover:bg-yellow-500/30"
            >
              Blocked Tasks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 bg-green-500/20 border border-green-500/30 text-white hover:bg-green-500/30"
            >
              Ready to Start
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 bg-blue-500/20 border border-blue-500/30 text-white hover:bg-blue-500/30"
            >
              High Priority
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
