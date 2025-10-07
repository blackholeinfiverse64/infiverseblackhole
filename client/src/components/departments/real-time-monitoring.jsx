import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import { ScrollArea } from "../ui/scroll-area" // Removed - no scrolling
import { 
  Activity,
  Bell,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Plus,
  UserPlus,
  Edit,
  Trash2,
  MessageSquare,
  Target,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Settings,
  RefreshCw
} from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"
import { useSocketContext } from "../../context/socket-context"
import { formatDistanceToNow } from "date-fns"

export function RealTimeDepartmentMonitoring({ departments }) {
  const [activities, setActivities] = useState([])
  const [notifications, setNotifications] = useState([])
  const [departmentStats, setDepartmentStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { toast } = useToast()
  const { events } = useSocketContext()

  useEffect(() => {
    fetchMonitoringData()
  }, [])

  useEffect(() => {
    // Listen for real-time events
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]
      handleRealTimeEvent(latestEvent)
    }
  }, [events])

  useEffect(() => {
    // Auto-refresh every 30 seconds if enabled
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchMonitoringData()
      }, 30000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true)
      
      // Generate mock real-time data for demonstration
      const mockActivities = generateMockActivities(departments)
      const mockNotifications = generateMockNotifications(departments)
      const mockStats = generateMockStats(departments)
      
      setActivities(mockActivities)
      setNotifications(mockNotifications)
      setDepartmentStats(mockStats)
      
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
      toast({
        title: "Error",
        description: "Failed to load monitoring data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRealTimeEvent = (event) => {
    // Handle different types of real-time events
    switch (event.type) {
      case 'department-created':
      case 'department-updated':
      case 'department-deleted':
        addActivity({
          id: Date.now(),
          type: event.type,
          department: event.data.name,
          message: getEventMessage(event.type, event.data),
          timestamp: new Date(),
          user: 'System',
          priority: 'medium'
        })
        break
      case 'task-created':
      case 'task-updated':
      case 'task-completed':
        if (event.data.department) {
          addActivity({
            id: Date.now(),
            type: event.type,
            department: event.data.department.name,
            message: getTaskEventMessage(event.type, event.data),
            timestamp: new Date(),
            user: event.data.assignee?.name || 'Unknown',
            priority: event.type === 'task-completed' ? 'high' : 'low'
          })
        }
        break
      default:
        break
    }
  }

  const addActivity = (activity) => {
    setActivities(prev => [activity, ...prev.slice(0, 49)]) // Keep last 50 activities
    
    // Add notification if high priority
    if (activity.priority === 'high') {
      addNotification({
        id: Date.now(),
        title: 'Important Update',
        message: activity.message,
        department: activity.department,
        timestamp: new Date(),
        read: false,
        type: 'success'
      })
    }
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]) // Keep last 20 notifications
  }

  const getEventMessage = (type, data) => {
    switch (type) {
      case 'department-created':
        return `New department "${data.name}" has been created`
      case 'department-updated':
        return `Department "${data.name}" has been updated`
      case 'department-deleted':
        return `Department "${data.name}" has been deleted`
      default:
        return 'Unknown event occurred'
    }
  }

  const getTaskEventMessage = (type, data) => {
    switch (type) {
      case 'task-created':
        return `New task "${data.title}" assigned in ${data.department.name}`
      case 'task-updated':
        return `Task "${data.title}" updated in ${data.department.name}`
      case 'task-completed':
        return `Task "${data.title}" completed in ${data.department.name}`
      default:
        return 'Task event occurred'
    }
  }

  const generateMockActivities = (departments) => {
    const activities = []
    const activityTypes = [
      'task-created', 'task-updated', 'task-completed', 
      'user-joined', 'user-left', 'meeting-scheduled',
      'deadline-approaching', 'milestone-reached'
    ]
    
    for (let i = 0; i < 20; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)]
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const timestamp = new Date(Date.now() - Math.random() * 86400000) // Random time in last 24 hours
      
      activities.push({
        id: i,
        type,
        department: dept?.name || 'Unknown',
        message: generateMockMessage(type, dept?.name),
        timestamp,
        user: `User ${Math.floor(Math.random() * 10) + 1}`,
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      })
    }
    
    return activities.sort((a, b) => b.timestamp - a.timestamp)
  }

  const generateMockNotifications = (departments) => {
    const notifications = []
    const types = ['info', 'warning', 'success', 'error']
    
    for (let i = 0; i < 10; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      
      notifications.push({
        id: i,
        title: `Department Alert`,
        message: `Important update in ${dept?.name || 'Unknown Department'}`,
        department: dept?.name || 'Unknown',
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
        read: Math.random() > 0.5,
        type
      })
    }
    
    return notifications.sort((a, b) => b.timestamp - a.timestamp)
  }

  const generateMockStats = (departments) => {
    const stats = {}
    
    departments.forEach(dept => {
      const deptId = dept._id || dept.id
      stats[deptId] = {
        activeUsers: Math.floor(Math.random() * 10) + 1,
        ongoingTasks: Math.floor(Math.random() * 20) + 5,
        completedToday: Math.floor(Math.random() * 5),
        pendingActions: Math.floor(Math.random() * 8),
        activityLevel: Math.random() > 0.3 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        lastActivity: new Date(Date.now() - Math.random() * 3600000)
      }
    })
    
    return stats
  }

  const generateMockMessage = (type, department) => {
    const messages = {
      'task-created': `New task assigned in ${department}`,
      'task-updated': `Task progress updated in ${department}`,
      'task-completed': `Task completed in ${department}`,
      'user-joined': `New team member joined ${department}`,
      'user-left': `Team member left ${department}`,
      'meeting-scheduled': `Meeting scheduled for ${department}`,
      'deadline-approaching': `Deadline approaching in ${department}`,
      'milestone-reached': `Milestone achieved in ${department}`
    }
    
    return messages[type] || `Activity in ${department}`
  }

  const getActivityIcon = (type) => {
    const icons = {
      'task-created': <Plus className="h-4 w-4 text-blue-400" />,
      'task-updated': <Edit className="h-4 w-4 text-yellow-400" />,
      'task-completed': <CheckCircle className="h-4 w-4 text-green-400" />,
      'user-joined': <UserPlus className="h-4 w-4 text-green-400" />,
      'user-left': <Users className="h-4 w-4 text-red-400" />,
      'meeting-scheduled': <Calendar className="h-4 w-4 text-purple-400" />,
      'deadline-approaching': <AlertTriangle className="h-4 w-4 text-orange-400" />,
      'milestone-reached': <Target className="h-4 w-4 text-green-400" />
    }
    
    return icons[type] || <Activity className="h-4 w-4 text-gray-400" />
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-500/10'
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/10'
      case 'error': return 'border-l-red-500 bg-red-500/10'
      default: return 'border-l-blue-500 bg-blue-500/10'
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
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
      {/* Monitoring Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Real-Time Department Monitoring
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`${autoRefresh ? 'bg-green-500/20 border-green-500/30 text-green-200' : 'bg-slate-700/50 border-slate-600 text-white'}`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMonitoringData}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <div className="space-y-3">
                  {activities.map(activity => (
                    <div 
                      key={activity.id} 
                      className={`p-3 bg-slate-700/30 rounded-lg border-l-4 ${getPriorityColor(activity.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                              {activity.department}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              by {activity.user}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-400" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="bg-red-500/20 text-red-200 ml-2">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <div className="space-y-2">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border-l-4 cursor-pointer hover:bg-slate-600/30 ${getNotificationColor(notification.type)} ${notification.read ? 'opacity-60' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white text-sm font-medium">{notification.title}</p>
                          <p className="text-gray-300 text-xs">{notification.message}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Department Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departments.slice(0, 5).map(dept => {
                  const deptId = dept._id || dept.id
                  const stats = departmentStats[deptId] || {}
                  
                  return (
                    <div key={deptId} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="text-white text-sm">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            stats.activityLevel === 'high' ? 'bg-green-500/20 text-green-200' :
                            stats.activityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                            'bg-gray-500/20 text-gray-200'
                          }
                        >
                          {stats.activityLevel || 'low'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {stats.activeUsers || 0} active
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}