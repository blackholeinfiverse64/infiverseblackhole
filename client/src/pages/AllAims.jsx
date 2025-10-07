"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Loader2, Calendar, Filter, RefreshCw, Clock, Bell, ChevronLeft, ChevronRight, MapPin, TrendingUp, CheckCircle, AlertCircle, Target, User, Sparkles, Zap } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../context/auth-context"
import { api, API_URL } from "../lib/api"
import { format, addDays, subDays } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { SpaceParticles, CosmicOrbs } from "../components/ui/space-particles"
import axios from "axios"

function AllAims() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [aims, setAims] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingReminders, setIsSendingReminders] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [automateAimReminders, setAutomateAimReminders] = useState(false)
  const [automateProgressReminders, setAutomateProgressReminders] = useState(false)
  const filterCardRef = useRef(null)

  const fetchData = useCallback(async () => {
    const scrollPosition = filterCardRef.current ? filterCardRef.current.getBoundingClientRect().top + window.scrollY : 0
    try {
      setIsLoading(true)

      // Fetch departments
      const departmentsResponse = await api.departments.getDepartments()
      console.log('AllAims - Departments response:', departmentsResponse)
      const departmentsData = departmentsResponse.success ? departmentsResponse.data : departmentsResponse
      setDepartments(Array.isArray(departmentsData) ? departmentsData : [])

      // Fetch enhanced aims with progress data
      const filters = {}
      if (selectedDepartment && selectedDepartment !== "all") filters.department = selectedDepartment
      if (selectedDate) filters.date = selectedDate.toISOString()

      try {
        // Try enhanced API first
        const enhancedResponse = await axios.get(`${API_URL || 'http://localhost:5000/api'}/enhanced-aims/with-progress`, {
          params: filters,
          headers: {
            'x-auth-token': localStorage.getItem('WorkflowToken')
          }
        })
        console.log('AllAims - Enhanced aims response:', enhancedResponse.data)
        const enhancedAims = enhancedResponse.data.success ? enhancedResponse.data.data : enhancedResponse.data
        console.log('AllAims - Enhanced aims processed:', enhancedAims)
        
        // Log progress entries for each aim
        if (Array.isArray(enhancedAims)) {
          enhancedAims.forEach(aim => {
            console.log(`User ${aim.user?.name}: progressEntries=${aim.progressEntries?.length || 0}, isPending=${aim.isPending}`);
            if (aim.progressEntries && aim.progressEntries.length > 0) {
              console.log('Progress entries:', aim.progressEntries);
            }
          });
        }
        
        setAims(Array.isArray(enhancedAims) ? enhancedAims : [])
      } catch (enhancedError) {
        console.log('Enhanced API failed, using regular API:', enhancedError)
        // Fallback to regular API
        const aimsData = await api.aims.getAims(filters)
        console.log('AllAims - Regular aims data:', aimsData)
        setAims(Array.isArray(aimsData) ? aimsData : [])
      }

      setAutomateAimReminders(false)
      setAutomateProgressReminders(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load aims data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (filterCardRef.current) {
        window.scrollTo({ top: scrollPosition, behavior: "instant" })
      }
    }
  }, [selectedDate, selectedDepartment, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    fetchData()
  }

  const handleSendReminders = async () => {
    try {
      setIsSendingReminders(true)
      const result = await api.notifications.broadcastAimReminders()
      toast({
        title: "Success",
        description: `Sent ${result.emails.length} aim reminder emails to users`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error sending reminders:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder emails",
        variant: "destructive",
      })
    } finally {
      setIsSendingReminders(false)
    }
  }

  const handleToggleAutomation = async (type, value) => {
    try {
      if (type === "aim") {
        setAutomateAimReminders(value)
      } else {
        setAutomateProgressReminders(value)
      }

      await api.notifications.toggleAutomation({
        automateAimReminders: type === "aim" ? value : automateAimReminders,
        automateProgressReminders: type === "progress" ? value : automateProgressReminders,
      })

      toast({
        title: "Success",
        description: `Automation for ${type} reminders ${value ? "enabled" : "disabled"}`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating automation settings:", error)
      toast({
        title: "Error",
        description: "Failed to update automation settings",
        variant: "destructive",
      })

      if (type === "aim") {
        setAutomateAimReminders(!value)
      } else {
        setAutomateProgressReminders(!value)
      }
    }
  }

  const handlePreviousDate = () => {
    setSelectedDate(subDays(selectedDate, 1))
  }

  const handleNextDate = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "h:mm a")
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'h:mm a');
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

  const getStatusColor = (status, isPending) => {
    if (isPending) {
      return 'bg-orange-100 text-orange-800';
    }
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'MVP Achieved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status, isPending) => {
    if (isPending) {
      return <Clock className="h-3 w-3" />;
    }
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'MVP Achieved':
        return <Target className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status, isPending) => {
    if (isPending) {
      return 'Pending Progress';
    }
    return status;
  };

  const renderAimCard = (aim) => {
    const isPending = aim.isPending || (aim.progressPercentage === 0 && (!aim.progressEntries || aim.progressEntries.length === 0));
    
    return (
      <div key={aim._id} className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/40 rounded-xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
              <User className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-white">
                {aim.user?.name || "Unknown User"}
              </span>
            </div>
            
            {/* Enhanced Work Location Tag */}
            <span className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 border transition-all duration-300 ${
              aim.workSessionInfo?.workLocationTag === 'WFH' || aim.workLocation === 'Home'
                ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-300'
                : aim.workSessionInfo?.workLocationTag === 'Remote' || aim.workLocation === 'Remote'
                ? 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-300'
                : 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 text-green-300'
            }`}>
              <MapPin className="h-3 w-3" />
              {aim.workSessionInfo?.workLocationTag || aim.workLocation || 'Office'}
            </span>
            
            {/* Enhanced Progress Percentage */}
            {aim.progressPercentage > 0 && (
              <span className="px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1.5 transition-all duration-300">
                <TrendingUp className="h-3 w-3" />
                {aim.progressPercentage}% Complete
              </span>
            )}
            
            {/* Enhanced Completion Status */}
            <span className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 border transition-all duration-300 ${
              isPending
                ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 text-orange-300'
                : aim.completionStatus === 'Completed'
                ? 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 text-green-300'
                : aim.completionStatus === 'MVP Achieved'
                ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-300'
                : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 border-gray-500/30 text-gray-300'
            }`}>
              {getStatusIcon(aim.completionStatus, isPending)}
              {getStatusText(aim.completionStatus, isPending)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/60 bg-slate-800/30 px-3 py-1.5 rounded-lg border border-slate-600/30">
            <Clock className="h-3 w-3" />
            <span>{formatTime(aim.createdAt)}</span>
          </div>
        </div>

        {/* Department info */}
        {aim.department && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 border border-indigo-500/30 rounded-lg">
            <span className="text-sm font-medium text-indigo-300 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Sector: {aim.department.name}
            </span>
          </div>
        )}

        {/* Enhanced main aim content */}
        <div className="mb-4 p-4 bg-slate-800/20 rounded-lg border border-slate-600/30">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Mission Objective
          </h4>
          <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
            {aim.aims}
          </p>
        </div>

        {/* Enhanced Progress Information */}
        {(aim.progressEntries && aim.progressEntries.length > 0) ? (
          <div className="mb-4 p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress Transmissions ({aim.progressEntries.length} updates)
            </h4>
            
            <div className="space-y-3">
              {aim.progressEntries.map((entry) => (
                <div key={entry._id} className="p-3 bg-slate-800/40 rounded-lg border border-green-500/20 hover:border-green-400/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-300 flex items-center gap-1.5">
                      <Target className="h-3 w-3" />
                      {entry.task?.title || 'General Progress'}
                    </span>
                    <span className="text-xs text-white/60 bg-slate-700/50 px-2 py-1 rounded">
                      {formatTime(entry.date)} - {entry.progressPercentage}%
                    </span>
                  </div>
                  
                  {entry.notes && (
                    <div className="mb-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <span className="text-xs font-medium text-blue-300">Notes: </span>
                      <span className="text-xs text-white/80">{entry.notes}</span>
                    </div>
                  )}
                  
                  {entry.achievements && (
                    <div className="mb-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                      <span className="text-xs font-medium text-green-300 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Achievements: 
                      </span>
                      <span className="text-xs text-white/80 ml-1">{entry.achievements}</span>
                    </div>
                  )}
                  
                  {entry.blockers && (
                    <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                      <span className="text-xs font-medium text-red-300 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Blockers: 
                      </span>
                      <span className="text-xs text-white/80 ml-1">{entry.blockers}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-300 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Awaiting Progress Transmission
            </h4>
            <p className="text-xs text-orange-200">No progress signals received from this team member today.</p>
          </div>
        )}

        {/* Enhanced Work Session Info */}
        {aim.workSessionInfo && (aim.workSessionInfo.startDayTime || aim.workSessionInfo.totalHoursWorked > 0) && (
          <div className="mb-4 p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Work Session
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              {aim.workSessionInfo.startDayTime && (
                <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <span className="font-medium text-blue-300">Launch:</span>
                  <span className="text-white/80">
                    {formatTime(aim.workSessionInfo.startDayTime)}
                  </span>
                </div>
              )}
              
              {aim.workSessionInfo.endDayTime && (
                <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <span className="font-medium text-blue-300">Landing:</span>
                  <span className="text-white/80">
                    {formatTime(aim.workSessionInfo.endDayTime)}
                  </span>
                </div>
              )}
              
              {aim.workSessionInfo.totalHoursWorked > 0 && (
                <div className="col-span-2 flex items-center justify-between p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
                  <span className="font-medium text-cyan-300">Mission Duration:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {aim.workSessionInfo.totalHoursWorked}h
                    </span>
                    {aim.workSessionInfo.totalHoursWorked >= 8 && (
                      <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded border border-green-500/30">
                        ✓ Full Orbit
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Completion Comment */}
        {aim.completionComment && (
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mission Debrief
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              {aim.completionComment}
            </p>
          </div>
        )}
      </div>
    );
  };

  const groupAimsByDepartment = () => {
    const grouped = {}

    aims.forEach((aim) => {
      const deptName = aim.department?.name || "No Department"
      if (!grouped[deptName]) {
        grouped[deptName] = []
      }
      grouped[deptName].push(aim)
    })

    return grouped
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-transparent overflow-hidden">
        <SpaceParticles count={40} className="opacity-50" />
        <CosmicOrbs count={6} className="opacity-20" />
        
        <div className="relative z-10 flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading Aims</h3>
              <p className="text-white/60">Gathering team objectives...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      {/* LAYER 1: Background */}
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="absolute inset-0 cosmic-grid opacity-5"></div>
      
      {/* LAYER 2: Space Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl animate-pulse" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '18s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-72 h-72 bg-cyan-600/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '20s', animationDelay: '8s'}}></div>
      </div>

      {/* LAYER 3: Particles */}
      <SpaceParticles count={60} className="opacity-40" />
      <CosmicOrbs count={8} className="opacity-25" />
      
      {/* LAYER 4: Main Content with hidden scrollbar */}
      <div className="relative z-10 space-y-8 p-4 lg:p-8 h-screen overflow-y-auto scrollbar-none overflow-x-hidden">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 py-8">
          <div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Aims Dashboard
            </h1>
            <p className="text-white/70 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Navigate through team objectives across departments and track progress through time
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>

            <Button 
              variant="outline" 
              onClick={handleSendReminders} 
              disabled={isSendingReminders}
              className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 transition-all duration-300"
            >
              {isSendingReminders ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bell className="mr-2 h-4 w-4" />
              )}
              Send Reminders
            </Button>
          </div>
        </div>

        {/* Reminder Settings */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              Reminder Matrix
            </CardTitle>
            <CardDescription className="text-white/60">Configure automated reminder frequencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    Daily Aim Transmissions
                  </h3>
                  <p className="text-sm text-white/70">Automatically broadcast objectives at 10:00 AM across all sectors</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="aim-automation"
                    checked={automateAimReminders}
                    onCheckedChange={(value) => handleToggleAutomation("aim", value)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="aim-automation" className={`text-sm font-medium ${
                    automateAimReminders ? 'text-blue-300' : 'text-white/60'
                  }`}>
                    {automateAimReminders ? "Active" : "Dormant"}
                  </Label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    Progress Signal Updates
                  </h3>
                  <p className="text-sm text-white/70">Automatically request progress signals at 5:00 PM from all stations</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="progress-automation"
                    checked={automateProgressReminders}
                    onCheckedChange={(value) => handleToggleAutomation("progress", value)}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label htmlFor="progress-automation" className={`text-sm font-medium ${
                    automateProgressReminders ? 'text-purple-300' : 'text-white/60'
                  }`}>
                    {automateProgressReminders ? "Active" : "Dormant"}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>        {/* Filter Controls */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-purple-500/20 backdrop-blur-md shadow-xl" ref={filterCardRef}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Filter className="h-5 w-5 text-purple-400" />
              </div>
              Navigation Controls
            </CardTitle>
            <CardDescription className="text-white/60">Navigate through departments and time dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <Label htmlFor="department-filter" className="mb-3 block text-white font-medium">
                  Department Sector
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="department-filter" className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">All Sectors</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id} className="text-white hover:bg-slate-700">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/3">
                <Label className="mb-3 block text-white font-medium">Time Dimension</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePreviousDate}
                    className="bg-slate-800/50 hover:bg-blue-500/20 border-slate-600/50 hover:border-blue-400/50 text-white transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center text-white font-medium py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-600/50">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextDate}
                    className="bg-slate-800/50 hover:bg-blue-500/20 border-slate-600/50 hover:border-blue-400/50 text-white transition-all duration-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex items-end">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                  onClick={handleRefresh}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="by-department">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto bg-slate-800/50 border border-slate-600/50">
            <TabsTrigger value="by-department" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-white">
              By Sector
            </TabsTrigger>
            <TabsTrigger value="all-aims" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white">
              All Objectives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-department" className="mt-8">
            {Object.keys(groupAimsByDepartment()).length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-orange-500/20 backdrop-blur-md shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Objectives Found</h3>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    No objectives have been set for the selected time and department.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupAimsByDepartment()).map(([deptName, deptAims]) => (
                  <Card key={deptName} className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>
                        {deptName}
                      </CardTitle>
                      <CardDescription className="text-white/60">{deptAims.length} team members have set objectives</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {deptAims.map((aim) => renderAimCard(aim))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-aims" className="mt-8">
            {aims.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-orange-500/20 backdrop-blur-md shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Objectives Found</h3>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    No objectives have been set for the selected time and department.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-purple-500/20 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                    All Objectives for {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription className="text-white/60">{aims.length} team members have set objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aims.map((aim) => renderAimCard(aim))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AllAims
