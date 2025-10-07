import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { format } from "date-fns";

export function DepartmentDetails({ department, onBack }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState({
    users: [],
    tasks: [],
    aims: [],
    stats: {}
  });

  useEffect(() => {
    if (department) {
      fetchDepartmentDetails();
    }
  }, [department]);

  const fetchDepartmentDetails = async () => {
    try {
      setLoading(true);
      
      // Get department ID (handle both _id and id)
      const departmentId = department._id || department.id;
      if (!departmentId) {
        throw new Error("Department ID is missing");
      }

      console.log("Fetching details for department:", departmentId, department);
      
      // Fetch department users
      const usersResponse = await api.users.getUsers();
      const departmentUsers = usersResponse.filter(user => 
        user.department && (user.department._id === departmentId || user.department.id === departmentId)
      );

      // Fetch department tasks
      const tasksResponse = await api.departments.getDepartmentTasks(departmentId);
      
      // Fetch department aims - using the with-progress endpoint
      let aimsResponse = { success: true, data: [] };
      try {
        const aimsData = await api.aims.getAimsWithProgress({
          department: departmentId,
          date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
        });
        aimsResponse = aimsData.success ? aimsData : { success: true, data: Array.isArray(aimsData) ? aimsData : [] };
      } catch (aimsError) {
        console.warn("Could not fetch aims for department:", aimsError);
        // Continue without aims data
        aimsResponse = { success: false, data: [] };
      }

      // Calculate department statistics
      const stats = calculateDepartmentStats(departmentUsers, tasksResponse, aimsResponse.data);

      setDepartmentData({
        users: departmentUsers,
        tasks: tasksResponse,
        aims: aimsResponse.data,
        stats
      });

    } catch (error) {
      console.error("Error fetching department details:", error);
      toast({
        title: "Error",
        description: "Failed to load department details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDepartmentStats = (users, tasks, aims) => {
    const totalUsers = users.length;
    const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
    const totalAims = Array.isArray(aims) ? aims.length : 0;
    
    // Task statistics
    const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'Completed').length : 0;
    const inProgressTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'In Progress').length : 0;
    const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'Pending').length : 0;
    
    // Aim statistics
    const completedAims = Array.isArray(aims) ? aims.filter(aim => aim.completionStatus === 'Completed').length : 0;
    const pendingAims = Array.isArray(aims) ? aims.filter(aim => aim.isPending).length : 0;
    const aimsWithProgress = Array.isArray(aims) ? aims.filter(aim => !aim.isPending).length : 0;
    
    // Attendance statistics (from aims data)
    const presentUsers = Array.isArray(aims) ? aims.filter(aim => 
      aim.workSessionInfo && aim.workSessionInfo.startDayTime
    ).length : 0;
    
    return {
      totalUsers,
      totalTasks,
      totalAims,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completedAims,
      pendingAims,
      aimsWithProgress,
      presentUsers,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      aimCompletionRate: totalAims > 0 ? Math.round((completedAims / totalAims) * 100) : 0,
      attendanceRate: totalUsers > 0 ? Math.round((presentUsers / totalUsers) * 100) : 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500";
      case "Pending":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500";
      case "Medium":
        return "bg-amber-500/10 text-amber-500";
      case "Low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getLocationColor = (location) => {
    switch (location) {
      case 'WFH':
      case 'Home':
        return 'bg-blue-100 text-blue-800';
      case 'Remote':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-1">Loading department details...</p>
            <p className="text-sm text-white/60">Please wait while we fetch the information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="glass-button border border-primary/30 hover:border-gold/50 bg-background/20 hover:bg-primary/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <div 
                className="w-6 h-6 rounded-full ring-2 ring-white/30 shadow-lg" 
                style={{ backgroundColor: department.color }}
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  {department.name}
                </h1>
                <p className="text-white/70 mt-1">
                  {department.description || "Department overview and management"}
                </p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchDepartmentDetails}
            className="glass-button border border-primary/30 hover:border-gold/50 bg-background/20 hover:bg-primary/10 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border border-success/20 bg-background/10 backdrop-blur-md hover:border-success/40 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Team Members</CardTitle>
            <div className="p-2 rounded-lg bg-success/20 border border-success/30">
              <Users className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{departmentData.stats.totalUsers}</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-white/70">
                {departmentData.stats.presentUsers} present • {departmentData.stats.attendanceRate}% attendance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{departmentData.stats.totalTasks}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700"
                  style={{ width: `${departmentData.stats.taskCompletionRate}%` }}
                />
              </div>
              <p className="text-sm text-white/70">
                {departmentData.stats.taskCompletionRate}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-gold/20 bg-background/10 backdrop-blur-md hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Daily Aims</CardTitle>
            <div className="p-2 rounded-lg bg-gold/20 border border-gold/30">
              <Target className="h-5 w-5 text-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{departmentData.stats.totalAims}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-700"
                  style={{ width: `${departmentData.stats.aimCompletionRate}%` }}
                />
              </div>
              <p className="text-sm text-white/70">
                {departmentData.stats.aimCompletionRate}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-accent/20 bg-background/10 backdrop-blur-md hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Progress Updates</CardTitle>
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{departmentData.stats.aimsWithProgress}</div>
            <p className="text-sm text-white/70">
              Active progress tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Detailed Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <div className="glass-card border border-primary/20 bg-background/10 backdrop-blur-md rounded-xl p-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto bg-background/20 border border-primary/20">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/40 text-white/70 hover:text-white transition-all duration-300"
            >
              Team Members
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/40 text-white/70 hover:text-white transition-all duration-300"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="aims"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/40 text-white/70 hover:text-white transition-all duration-300"
            >
              Daily Aims
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="glass-card border border-primary/20 bg-background/5 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20 border border-success/30">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Team Members ({departmentData.users.length})</CardTitle>
                    <CardDescription className="text-white/70">All members in this department</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {departmentData.users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-white/60 mb-2">No team members found in this department.</p>
                    <p className="text-xs text-white/40">Members will appear here once assigned</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departmentData.users.map((user) => {
                      const userAim = departmentData.aims.find(aim => aim.user && aim.user._id === user._id);
                      const isPresent = userAim && userAim.workSessionInfo && userAim.workSessionInfo.startDayTime;
                      
                      return (
                        <div key={user._id} className="glass-card border border-white/10 bg-background/10 p-4 rounded-xl hover:border-primary/30 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {user.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="text-xs text-white/60">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {user.role}
                            </Badge>
                            <Badge className={isPresent ? 
                              "bg-green-500/20 text-green-400 border-green-500/30" : 
                              "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }>
                              {isPresent ? "Present" : "Absent"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Tasks ({departmentData.tasks.length})</CardTitle>
              <CardDescription>All tasks assigned to this department</CardDescription>
            </CardHeader>
            <CardContent>
              {departmentData.tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p>No tasks found for this department.</p>
                </div>
              ) : (
                <div className="overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentData.tasks.map((task) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.assignee?.name || "Unassigned"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={task.progress || 0} className="w-16 h-2" />
                              <span className="text-xs">{task.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aims" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Aims ({departmentData.aims.length})</CardTitle>
              <CardDescription>Daily objectives set by team members</CardDescription>
            </CardHeader>
            <CardContent>
              {departmentData.aims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p>No aims set for today in this department.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentData.aims.map((aim) => (
                    <div key={aim._id} className="border rounded-lg p-4 bg-white shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">
                            {aim.user?.name || "Unknown User"}
                          </span>
                          
                          {/* Work Location Tag */}
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                            getLocationColor(aim.workSessionInfo?.workLocationTag || aim.workLocation)
                          }`}>
                            <MapPin className="h-3 w-3" />
                            {aim.workSessionInfo?.workLocationTag || aim.workLocation || 'Office'}
                          </span>
                          
                          {/* Progress Percentage */}
                          {aim.progressPercentage > 0 && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              {aim.progressPercentage}% Progress
                            </span>
                          )}
                          
                          {/* Status */}
                          <Badge className={aim.isPending ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                            {aim.isPending ? "Pending Progress" : aim.completionStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Set at {format(new Date(aim.createdAt), "h:mm a")}</span>
                        </div>
                      </div>

                      {/* Aim Content */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                          {aim.aims}
                        </p>
                      </div>

                      {/* Progress Information */}
                      {aim.progressEntries && aim.progressEntries.length > 0 ? (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">
                            Progress Updates ({aim.progressEntries.length})
                          </h4>
                          {aim.progressEntries.slice(0, 2).map((entry) => (
                            <div key={entry._id} className="mb-2 text-xs">
                              {entry.notes && (
                                <div className="text-gray-700">
                                  <span className="font-medium">Notes:</span> {entry.notes}
                                </div>
                              )}
                              {entry.achievements && (
                                <div className="text-green-700">
                                  <span className="font-medium">Achievements:</span> {entry.achievements}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-xs text-orange-600">No progress updates yet</p>
                        </div>
                      )}

                      {/* Work Session Info */}
                      {aim.workSessionInfo && aim.workSessionInfo.startDayTime && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <h4 className="text-xs font-semibold text-blue-700 mb-1">Work Session</h4>
                          <div className="text-xs text-blue-600">
                            Started: {format(new Date(aim.workSessionInfo.startDayTime), "h:mm a")}
                            {aim.workSessionInfo.totalHoursWorked > 0 && (
                              <span className="ml-2">• {aim.workSessionInfo.totalHoursWorked}h worked</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}