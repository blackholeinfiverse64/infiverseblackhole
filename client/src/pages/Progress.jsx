// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import { Slider } from "../components/ui/slider";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Loader2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
// import { api, API_URL } from "../lib/api";
// import { useToast } from "../hooks/use-toast";
// import { useAuth } from "../context/auth-context";
// import { ProgressChart } from "../components/progress/progress-chart";
// import { ProgressHistory } from "../components/progress/progress-history";
// import { format } from "date-fns";
// import axios from "axios";

// function Progress() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [progressValue, setProgressValue] = useState(0);
//   const [notes, setNotes] = useState("");
//   const [blockers, setBlockers] = useState("");
//   const [achievements, setAchievements] = useState("");
//   const [progressHistory, setProgressHistory] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);



//   useEffect(() => {
//     const fetchUserTasks = async () => {
//       try {
//         setIsLoading(true);
//         console.log("user in progress", user.id);
  
//         // Axios request to get tasks by user ID
//         const response = await axios.get(`${API_URL}/users/${user.id}/tasks`);
        
//         const filteredTasks = response.data.filter(task =>
//           ["Pending", "In Progress"].includes(task.status)
//         );
  
//         setTasks(filteredTasks);
  
//         // Select the first task by default if available
//         if (filteredTasks.length > 0) {
//           setSelectedTask(filteredTasks[0]);
//           setProgressValue(filteredTasks[0].progress || 0);
//           fetchProgressHistory(filteredTasks[0]._id);
//         }
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load your tasks",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     if (user) {
//       fetchUserTasks();
//     }
//   }, [user, toast]);
  

//   const fetchProgressHistory = async (taskId) => {
//     try {
//       const history = await api.progress.getTaskProgress(taskId);
//       setProgressHistory(history);
//     } catch (error) {
//       console.error("Error fetching progress history:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load progress history",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleTaskChange = (taskId) => {
//     const task = tasks.find(t => t._id === taskId);
//     if (task) {
//       setSelectedTask(task);
//       setProgressValue(task.progress || 0);
//       fetchProgressHistory(task._id);
//       // Reset form fields
//       setNotes("");
//       setBlockers("");
//       setAchievements("");
//     }
//   };

//   const handleSubmitProgress = async () => {
//     if (!selectedTask) {
//       toast({
//         title: "Error",
//         description: "Please select a task first",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);
      
//       const progressData = {
//         user: user.id,
//         task: selectedTask._id,
//         progressPercentage: progressValue,
//         notes,
//         blockers,
//         achievements,
//         date: new Date(),
//       };

//       await api.progress.createProgress(progressData);
      
//       // Update the task in the local state
//       const updatedTasks = tasks.map(task => 
//         task._id === selectedTask._id 
//           ? { ...task, progress: progressValue } 
//           : task
//       );
//       setTasks(updatedTasks);
      
//       // Update selected task
//       setSelectedTask({ ...selectedTask, progress: progressValue });
      
//       // Refresh progress history
//       fetchProgressHistory(selectedTask._id);
      
//       // Reset form fields
//       setNotes("");
//       setBlockers("");
//       setAchievements("");
      
//       toast({
//         title: "Success",
//         description: "Progress updated successfully",
//         variant: "success",
//       });
//     } catch (error) {
//       console.error("Error updating progress:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update progress",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[80vh]">
//         <div className="flex flex-col items-center gap-2">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p>Loading your tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   if (tasks.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[80vh] px-4">
//         <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
//         <h2 className="text-2xl font-bold mb-2">No Active Tasks</h2>
//         <p className="text-muted-foreground text-center mb-6">
//           You don't have any active tasks assigned to you at the moment.
//         </p>
//         <Button onClick={() => navigate("/dashboard")}>
//           Return to Dashboard
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Task Progress</h1>
//           <p className="text-muted-foreground">
//             Track and update your daily progress on assigned tasks
//           </p>
//         </div>
        
//         <div className="w-full md:w-64">
//           <Select 
//             value={selectedTask?._id} 
//             onValueChange={handleTaskChange}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select a task" />
//             </SelectTrigger>
//             <SelectContent>
//               {tasks.map(task => (
//                 <SelectItem key={task._id} value={task._id}>
//                   {task.title}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {selectedTask && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle>Update Progress</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <Label>Current Progress: {progressValue}%</Label>
//                   <span className="text-sm text-muted-foreground">
//                     Due: {format(new Date(selectedTask.dueDate), "PPP")}
//                   </span>
//                 </div>
//                 <Slider
//                   value={[progressValue]}
//                   onValueChange={(values) => setProgressValue(values[0])}
//                   max={100}
//                   step={1}
//                   className="py-4"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="notes">Today's Progress Notes</Label>
//                 <Textarea
//                   id="notes"
//                   placeholder="What did you accomplish today?"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="blockers">Blockers or Challenges</Label>
//                 <Textarea
//                   id="blockers"
//                   placeholder="Any issues preventing progress?"
//                   value={blockers}
//                   onChange={(e) => setBlockers(e.target.value)}
//                   rows={2}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="achievements">Key Achievements</Label>
//                 <Textarea
//                   id="achievements"
//                   placeholder="What are you most proud of today?"
//                   value={achievements}
//                   onChange={(e) => setAchievements(e.target.value)}
//                   rows={2}
//                 />
//               </div>

//               <Button 
//                 onClick={handleSubmitProgress} 
//                 disabled={isSubmitting}
//                 className="w-full"
//               >
//                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Submit Progress Update
//               </Button>
//             </CardContent>
//           </Card>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Task Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold text-lg">{selectedTask.title}</h3>
//                   <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium">Status</p>
//                     <p className="text-sm">{selectedTask.status}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Priority</p>
//                     <p className="text-sm">{selectedTask.priority}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Due Date</p>
//                     <p className="text-sm">{format(new Date(selectedTask.dueDate), "PPP")}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Days Left</p>
//                     <p className="text-sm">
//                       {Math.max(0, Math.ceil((new Date(selectedTask.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Progress Visualization</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ProgressChart 
//                   history={progressHistory} 
//                   dueDate={selectedTask.dueDate}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}

//       {selectedTask && progressHistory.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Progress History</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ProgressHistory history={progressHistory} />
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// export default Progress;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress as ProgressBar } from "../components/ui/progress";
import { 
  Loader2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  TrendingUp, 
  Rocket, 
  BarChart3, 
  Zap, 
  Clock,
  Star,
  Award,
  Timer
} from 'lucide-react';
import { api, API_URL } from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/auth-context";
import { ProgressChart } from "../components/progress/progress-chart";
import { ProgressHistory } from "../components/progress/progress-history";
import { format } from "date-fns";
import axios from "axios";
import SpaceParticles from "../components/optimization/SpaceParticles";
import CosmicOrbs from "../components/optimization/CosmicOrbs";

function Progress() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [blockers, setBlockers] = useState("");
  const [achievements, setAchievements] = useState("");
  const [progressHistory, setProgressHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        setIsLoading(true);
        console.log("user in progress", user.id);
  
        // Axios request to get tasks by user ID
        const response = await axios.get(`${API_URL}/users/${user.id}/tasks`);
        
        const filteredTasks = response.data.filter(task =>
          ["Pending", "In Progress"].includes(task.status)
        );
  
        setTasks(filteredTasks);
  
        // Select the first task by default if available
        if (filteredTasks.length > 0) {
          setSelectedTask(filteredTasks[0]);
          setProgressValue(filteredTasks[0].progress || 0);
          fetchProgressHistory(filteredTasks[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load your tasks");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user) {
      fetchUserTasks();
    }
  }, [user]);
  

  const fetchProgressHistory = async (taskId) => {
    try {
      const history = await api.progress.getTaskProgress(taskId);
      setProgressHistory(history);
    } catch (error) {
      console.error("Error fetching progress history:", error);
      toast.error("Failed to load progress history");
    }
  };

  const handleTaskChange = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      setSelectedTask(task);
      setProgressValue(task.progress || 0);
      fetchProgressHistory(task._id);
      // Reset form fields
      setNotes("");
      setBlockers("");
      setAchievements("");
    }
  };

  const handleSubmitProgress = async () => {
    if (!selectedTask) {
      toast.error("Please select a task first");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const progressData = {
        user: user.id,
        task: selectedTask._id,
        progressPercentage: progressValue,
        notes,
        blockers,
        achievements,
        date: new Date(),
      };

      await api.progress.createProgress(progressData);
      
      // Update the task in the local state
      const updatedTasks = tasks.map(task => 
        task._id === selectedTask._id 
          ? { ...task, progress: progressValue } 
          : task
      );
      setTasks(updatedTasks);
      
      // Update selected task
      setSelectedTask({ ...selectedTask, progress: progressValue });
      
      // Refresh progress history
      fetchProgressHistory(selectedTask._id);
      
      // Reset form fields
      setNotes("");
      setBlockers("");
      setAchievements("");
      
      toast.success("Progress updated successfully");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        {/* Space Background */}
        <div className="fixed inset-0 z-0">
          <SpaceParticles />
          <CosmicOrbs />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4 bg-white/10 border border-blue-300/30 backdrop-blur-sm rounded-lg p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-blue-100">Loading Progress Dashboard...</p>
              <p className="text-sm text-blue-200/70">Fetching your task data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        {/* Space Background */}
        <div className="fixed inset-0 z-0">
          <SpaceParticles />
          <CosmicOrbs />
        </div>
        
        {/* No Tasks Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
          <div className="text-center space-y-6 bg-white/10 border border-orange-300/30 backdrop-blur-sm rounded-lg p-8 max-w-md">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                <Target className="h-8 w-8 text-orange-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Tasks</h2>
              <p className="text-white/70 text-center mb-6">
                You don't have any active tasks assigned to you at the moment.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-blue-400/20 border-blue-300/30 text-blue-100 hover:bg-blue-400/30 backdrop-blur-sm"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Space Background */}
      <div className="fixed inset-0 z-0">
        <SpaceParticles />
        <CosmicOrbs />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        />
        
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              Progress Hub
            </h1>
            <p className="text-white/70 text-lg">
              Track and update your daily progress on assigned tasks
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <Select 
              value={selectedTask?._id} 
              onValueChange={handleTaskChange}
            >
              <SelectTrigger className="bg-white/10 border-blue-300/30 text-blue-100 backdrop-blur-sm">
                <SelectValue placeholder="Select a task to track" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-blue-300/30 backdrop-blur-sm">
                {tasks.map(task => (
                  <SelectItem key={task._id} value={task._id} className="text-white hover:bg-blue-400/20">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      {task.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTask && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white/10 border-blue-300/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-100 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-300" />
                  Update Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enhanced Progress Slider Section */}
                <div className="space-y-4 bg-blue-400/10 border border-blue-300/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-300" />
                      <Label className="text-blue-100 font-medium">Current Progress: {progressValue}%</Label>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-200/70">
                      <Clock className="h-4 w-4" />
                      Due: {format(new Date(selectedTask.dueDate), "MMM dd, yyyy")}
                    </div>
                  </div>
                  
                  {/* Progress Bar Visualization */}
                  <div className="space-y-2">
                    <ProgressBar 
                      value={progressValue} 
                      className="h-4 bg-blue-900/30 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-purple-400 [&>div]:to-cyan-400 [&>div]:shadow-lg [&>div]:shadow-blue-400/25" 
                    />
                    <div className="flex justify-between text-xs text-blue-200/60">
                      <span>0%</span>
                      <span className="font-medium">{progressValue}% Complete</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Slider */}
                  <Slider
                    value={[progressValue]}
                    onValueChange={(values) => setProgressValue(values[0])}
                    max={100}
                    step={1}
                    className="py-4 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-blue-500 [&>span:first-child]:to-purple-500 [&>span:last-child]:bg-white [&>span:first-child]:border-blue-400 [&>span:last-child]:border-white [&>span:last-child]:shadow-lg [&>span:last-child]:shadow-blue-400/25"
                  />
                  
                  {/* Progress Status */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {progressValue === 100 ? (
                      <div className="flex items-center gap-2 text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Task Complete! 🎉</span>
                      </div>
                    ) : progressValue >= 75 ? (
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Star className="h-4 w-4" />
                        <span>Almost there! Keep going! 🚀</span>
                      </div>
                    ) : progressValue >= 50 ? (
                      <div className="flex items-center gap-2 text-amber-300">
                        <TrendingUp className="h-4 w-4" />
                        <span>Great progress! 📈</span>
                      </div>
                    ) : progressValue >= 25 ? (
                      <div className="flex items-center gap-2 text-blue-300">
                        <Zap className="h-4 w-4" />
                        <span>Building momentum! ⚡</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-purple-300">
                        <Target className="h-4 w-4" />
                        <span>Let's get started! 🎯</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Notes Section */}
                <div className="space-y-2 bg-green-400/10 border border-green-300/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300" />
                    <Label htmlFor="notes" className="text-green-100 font-medium">Today's Progress Notes</Label>
                  </div>
                  <Textarea
                    id="notes"
                    placeholder="What did you accomplish today? Share your wins and progress..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="bg-white/10 border-green-300/30 text-green-100 placeholder:text-green-200/50 focus:border-green-300/50 backdrop-blur-sm"
                  />
                </div>

                {/* Enhanced Blockers Section */}
                <div className="space-y-2 bg-orange-400/10 border border-orange-300/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-300" />
                    <Label htmlFor="blockers" className="text-orange-100 font-medium">Blockers or Challenges</Label>
                  </div>
                  <Textarea
                    id="blockers"
                    placeholder="Any obstacles or issues preventing progress? Let's identify them..."
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    rows={2}
                    className="bg-white/10 border-orange-300/30 text-orange-100 placeholder:text-orange-200/50 focus:border-orange-300/50 backdrop-blur-sm"
                  />
                </div>

                {/* Enhanced Achievements Section */}
                <div className="space-y-2 bg-purple-400/10 border border-purple-300/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-300" />
                    <Label htmlFor="achievements" className="text-purple-100 font-medium">Key Achievements</Label>
                  </div>
                  <Textarea
                    id="achievements"
                    placeholder="What are you most proud of today? Celebrate your wins!"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    rows={2}
                    className="bg-white/10 border-purple-300/30 text-purple-100 placeholder:text-purple-200/50 focus:border-purple-300/50 backdrop-blur-sm"
                  />
                </div>

                {/* Enhanced Submit Button */}
                <Button 
                  onClick={handleSubmitProgress} 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Progress...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Submit Progress Update
                    </>
                  )}
                </Button>
            </CardContent>
          </Card>

            <div className="space-y-6">
              <Card className="bg-white/10 border-cyan-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-300" />
                    Task Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-cyan-400/10 border border-cyan-300/20 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-cyan-100 mb-2">{selectedTask.title}</h3>
                    <p className="text-sm text-cyan-200/80">{selectedTask.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-400/10 border border-blue-300/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-300" />
                        <p className="text-sm font-medium text-blue-100">Status</p>
                      </div>
                      <p className="text-sm text-white">{selectedTask.status}</p>
                    </div>
                    <div className="bg-purple-400/10 border border-purple-300/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-purple-300" />
                        <p className="text-sm font-medium text-purple-100">Priority</p>
                      </div>
                      <p className="text-sm text-white">{selectedTask.priority}</p>
                    </div>
                    <div className="bg-amber-400/10 border border-amber-300/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-amber-300" />
                        <p className="text-sm font-medium text-amber-100">Due Date</p>
                      </div>
                      <p className="text-sm text-white">{format(new Date(selectedTask.dueDate), "MMM dd, yyyy")}</p>
                    </div>
                    <div className="bg-green-400/10 border border-green-300/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer className="h-4 w-4 text-green-300" />
                        <p className="text-sm font-medium text-green-100">Days Left</p>
                      </div>
                      <p className="text-sm text-white">
                        {Math.max(0, Math.ceil((new Date(selectedTask.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-purple-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-300" />
                    Progress Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-purple-400/10 border border-purple-300/20 rounded-lg">
                  <ProgressChart 
                    history={progressHistory} 
                    dueDate={selectedTask.dueDate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTask && progressHistory.length > 0 && (
          <Card className="bg-white/10 border-indigo-300/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-indigo-100 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-300" />
                Progress History
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-indigo-400/10 border border-indigo-300/20 rounded-lg">
              <ProgressHistory history={progressHistory} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Progress;

