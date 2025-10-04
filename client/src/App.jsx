import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toaster";
import { WorkspaceProvider } from "./context/workspace-context";
import { SocketProvider } from "./context/socket-context";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { SplashScreen } from "./components/SplashScreen";
import { AuthWrapper, HomeRedirect } from "./components/AuthWrapper";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Dependencies from "./pages/Dependencies";
import Departments from "./pages/Departments";
import Optimization from "./pages/Optimization";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import TaskDetails from "./pages/TaskDetails";
import CompletedTasks from "./pages/CompletedTasks";
import Progress from "./pages/Progress";
import TodaysAim from "./pages/TodaysAim";
import AllAims from "./pages/AllAims";
import { DashboardProvider } from "./context/DashboardContext";
import Leaderboard from "./pages/Leaderboard";
import { EmployeeMonitoring } from "./pages/EmployeeMonitoring";
import AttendanceAnalytics from "./pages/AttendanceAnalytics";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import SalaryManagement from "./pages/SalaryManagement";
import IndividualSalaryManagement from "./pages/IndividualSalaryManagement";
import AttendanceDataManagement from "./components/admin/AttendanceDataManagement";
import AdminAimsView from "./components/admin/AdminAimsView";
import UserManagement from "./pages/UserManagement";
import LeaveRequest from "./pages/LeaveRequest";
import axios from "axios";
import { API_URL } from "./lib/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePushNotifications } from "./hooks/usePushNotifications";

function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const [recentReviews, setRecentReviews] = useState([]);
  const [hasNewReviews, setHasNewReviews] = useState(false);
  const { subscribe } = usePushNotifications()

  useEffect(() => {
    // Get user after splash completes to avoid premature access
    const user = JSON.parse(localStorage.getItem("WorkflowUser") || "{}");
    
    // Auto-subscribe to push notifications if user is logged in
    if (user?.id && !showSplash) {
      subscribe().catch(console.error)
    }
  }, [showSplash, subscribe])

  const markReviewsAsSeen = () => {
    setRecentReviews([]);
    setHasNewReviews(false);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const user = JSON.parse(localStorage.getItem("WorkflowUser") || "{}");
      if (!user?.id) {
        console.log("No user ID found in localStorage");
        setRecentReviews([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/${user.id}/submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("WorkflowToken")}`,
          },
        });
        
        const submissions = response.data || [];
        const submissionsWithStatus = submissions.filter(submission => 
          submission.status && 
          (submission.status.toLowerCase() === 'completed' || 
           submission.status.toLowerCase() === 'reviewed' ||
           submission.status.toLowerCase() === 'approved')
        );

        if (submissionsWithStatus.length > 0) {
          setRecentReviews(submissionsWithStatus);
          setHasNewReviews(true);
        }
      } catch (error) {
        console.error("Error fetching user submissions:", error);
        setRecentReviews([]);
      }
    };

    const user = JSON.parse(localStorage.getItem("WorkflowUser") || "{}");
    if (user?.id && localStorage.getItem("WorkflowToken") && !showSplash) {
      fetchReviews();
      
      // Set up periodic updates every 5 minutes
      const intervalId = setInterval(() => {
        // Fetch updated submissions every 5 minutes
        fetchReviews();
      }, 5 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [showSplash]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Router>
        <AuthProvider>
          <WorkspaceProvider>
            <SocketProvider>
              <SidebarProvider>
                <DashboardProvider
                  recentReviews={recentReviews}
                  hasNewReviews={hasNewReviews}
                  markReviewsAsSeen={markReviewsAsSeen}
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Home route - redirects based on auth status */}
                    <Route path="/" element={<HomeRedirect />} />

                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route
                        path="/all-aims"
                        element={
                          <ProtectedRoute>
                            <AllAims />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/aims"
                        element={
                          <ProtectedRoute>
                            <TodaysAim />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/progress"
                        element={
                          <ProtectedRoute>
                            <Progress />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admindashboard"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/userdashboard"
                        element={
                          <ProtectedRoute>
                            <UserDashboard />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/tasks"
                        element={
                          <ProtectedRoute>
                            <Tasks />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/tasks/:id"
                        element={
                          <ProtectedRoute>
                            <TaskDetails />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dependencies"
                        element={
                          <ProtectedRoute>
                            <Dependencies />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/departments"
                        element={
                          <ProtectedRoute>
                            <Departments />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/optimization"
                        element={
                          <ProtectedRoute>
                            <Optimization />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={<Settings />}
                      />
                      <Route
                        path="/completedtask"
                        element={
                          <ProtectedRoute>
                            <CompletedTasks />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/leaderboard"
                        element={
                          <ProtectedRoute>
                            <Leaderboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/monitoring"
                        element={
                          <ProtectedRoute>
                            <EmployeeMonitoring />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin-aims"
                        element={
                          <ProtectedRoute>
                            <AdminAimsView />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/user-management"
                        element={
                          <ProtectedRoute>
                            <UserManagement />
                          </ProtectedRoute>
                        }
                      />
                    </Route>
                  </Routes>
                  <Toaster />
                </DashboardProvider>
              </SidebarProvider>
            </SocketProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;