"use client"

import { useState } from "react"
import { TasksHeader } from "../components/tasks/tasks-header"
import { TasksList } from "../components/tasks/tasks-list"
import { TaskFilters } from "../components/tasks/task-filters"

function Tasks() {
  const [filters, setFilters] = useState({
    status: [],
    department: [],
    priority: undefined,
  })
  const [viewMode, setViewMode] = useState("table") // table or cards
  const [searchQuery, setSearchQuery] = useState("")

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in relative">
      {/* Space Background Elements */}
      <div className="absolute inset-0 cosmic-grid opacity-10 pointer-events-none"></div>
      
      {/* Enhanced Tasks Header */}
      <TasksHeader 
        onSearchChange={handleSearchChange}
        onViewModeChange={handleViewModeChange}
        viewMode={viewMode}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-8 relative z-10">
        {/* Enhanced Filters Sidebar */}
        <div className="xl:w-80 flex-shrink-0">
          <TaskFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Tasks List Area */}
        <div className="flex-1 min-w-0">
          <TasksList 
            filters={filters} 
            searchQuery={searchQuery}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  )
}

export default Tasks
