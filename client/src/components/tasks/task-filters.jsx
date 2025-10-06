"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  Flag, 
  RotateCcw,
  Sparkles
} from "lucide-react"
import { api } from "../../lib/api"

export function TaskFilters({ onFilterChange }) {
  const [status, setStatus] = useState([])
  const [department, setDepartment] = useState([])
  const [priority, setPriority] = useState("all")
  const [departments, setDepartments] = useState([])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.departments.getDepartments()
        console.log('TaskFilters - Departments response:', response)

        // Handle new API response format
        const data = response.success ? response.data : response
        setDepartments(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching departments:", error)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  // Calculate active filters count
  useEffect(() => {
    const count = status.length + department.length + (priority !== "all" ? 1 : 0)
    setActiveFiltersCount(count)
  }, [status, department, priority])

  const handleStatusChange = (value, checked) => {
    setStatus(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    )
  }

  const handleDepartmentChange = (value, checked) => {
    setDepartment(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    )
  }

  const handleApplyFilters = () => {
    onFilterChange({
      status,
      department,
      priority: priority === "all" ? undefined : priority,
    })
  }

  const handleClearFilters = () => {
    setStatus([])
    setDepartment([])
    setPriority("all")
    onFilterChange({
      status: [],
      department: [],
      priority: undefined,
    })
  }

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-warning" />
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case "High":
        return "text-red-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-white/70"
    }
  }

  return (
    <Card className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Status Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">Status</h3>
          </div>
          <div className="space-y-3">
            {["Completed", "In Progress", "Pending"].map(stat => (
              <div key={stat} className="flex items-center space-x-3 group">
                <Checkbox 
                  id={`status-${stat.toLowerCase()}`} 
                  onCheckedChange={(checked) => handleStatusChange(stat, checked)}
                  checked={status.includes(stat)}
                  className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor={`status-${stat.toLowerCase()}`}
                  className="text-white/80 group-hover:text-white transition-colors duration-300 flex items-center gap-2 cursor-pointer"
                >
                  {getStatusIcon(stat)}
                  {stat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">Department</h3>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
            {Array.isArray(departments) && departments.map(dept => (
              <div key={dept._id} className="flex items-center space-x-3 group">
                <Checkbox
                  id={`dept-${dept._id}`}
                  onCheckedChange={(checked) => handleDepartmentChange(dept._id, checked)}
                  checked={department.includes(dept._id)}
                  className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor={`dept-${dept._id}`}
                  className="text-white/80 group-hover:text-white transition-colors duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  {dept.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">Priority</h3>
          </div>
          <RadioGroup value={priority} onValueChange={setPriority} className="space-y-3">
            {["all", "High", "Medium", "Low"].map(prio => (
              <div key={prio} className="flex items-center space-x-3 group">
                <RadioGroupItem 
                  value={prio} 
                  id={`priority-${prio.toLowerCase()}`}
                  className="border-white/30 text-primary"
                />
                <Label 
                  htmlFor={`priority-${prio.toLowerCase()}`}
                  className={`group-hover:text-white transition-colors duration-300 cursor-pointer ${
                    prio === "all" ? "text-white/80" : getPriorityColor(prio)
                  }`}
                >
                  {prio === "all" ? "All Priorities" : prio}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Button 
            className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-gold/50 text-white transition-all duration-300" 
            onClick={handleApplyFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              className="w-full border-white/30 hover:border-white/50 text-white/80 hover:text-white bg-transparent hover:bg-white/5 transition-all duration-300" 
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
