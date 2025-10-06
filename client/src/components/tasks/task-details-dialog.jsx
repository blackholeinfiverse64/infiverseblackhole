import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, User, Flag, FileText } from "lucide-react"

export function TaskDetailsDialog({ task, open, onOpenChange }) {
  if (!task) return null

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border border-primary/20 bg-background/90 backdrop-blur-md max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {task.title}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Task details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Status:</span>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-white/60" />
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-white/60" />
            <span className="text-white/60 text-sm">Assigned to:</span>
            <span className="text-white">{task.assignee?.name || "Unassigned"}</span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className="text-white/60 text-sm">Due date:</span>
              <span className="text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="text-white font-medium mb-2">Description</h4>
              <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">
                {task.description}
              </p>
            </div>
          )}

          {/* Department */}
          {task.assignee?.department && (
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Department:</span>
              <span className="text-white">{task.assignee.department.name}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}