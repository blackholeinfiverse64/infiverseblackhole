import { useState, useEffect, Suspense, lazy } from "react";
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
import { DashboardProvider } from "./context/DashboardContext";
import axios from "axios";
import { API_URL } from "./lib/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePushNotifications } from "./hooks/usePushNotifications";
import ErrorBoundary from "./components/ErrorBoundary";
import { Zap } from "lucide-react";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Dependencies = lazy(() => import("./pages/Dependencies").then(module => ({ default: module.Dependencies })));
const Departments = lazy(() => import("./pages/Departments"));
const Optimization = lazy(() => import("./pages/Optimization"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const CompletedTasks = lazy(() => import("./pages/CompletedTasks"));
const Progress = lazy(() => import("./pages/Progress"));
const TodaysAim = lazy(() => import("./pages/TodaysAim"));
const AllAims = lazy(() => import("./pages/AllAims"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const EmployeeMonitoring = lazy(() => import("./pages/EmployeeMonitoring").then(module => ({ default: module.EmployeeMonitoring })));
const AttendanceAnalytics = lazy(() => import("./pages/AttendanceAnalytics"));
const AttendanceDashboard = lazy(() => import("./pages/AttendanceDashboard"));
const SalaryManagement = lazy(() => import("./pages/SalaryManagement"));
const IndividualSalaryManagement = lazy(() => import("./pages/IndividualSalaryManagement"));
const AttendanceDataManagement = lazy(() => import("./components/admin/AttendanceDataManagement"));
const AdminAimsView = lazy(() => import("./components/admin/AdminAimsView"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const LeaveRequest = lazy(() => import("./pages/LeaveRequest"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-transparent flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
          <Zap className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white">Loading...</h3>
      <p className="text-white/60">Preparing your cosmic experience...</p>
    </div>
  </div>
);

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
    <ErrorBoundary>
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
                    <Suspense fallback={<PageLoader />}>
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
                    </Suspense>
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
    </ErrorBoundary>
  );
}

export default App;