import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Network, Users, Sparkles, Settings, LogOut, CheckCircle, BarChart, Airplay, LayoutDashboardIcon, Target, Monitor, DollarSign, Calendar, Clock, UserCog, UserCheck } from "lucide-react";
import { useAuth } from "../../context/auth-context";

export function DashboardSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const baseRoutes = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Tasks", href: "/tasks", icon: CheckSquare },
    { title: "Dependencies", href: "/dependencies", icon: Network },
    { title: "Departments", href: "/departments", icon: Users },
    { title: "AI Optimization", href: "/optimization", icon: Sparkles },
     { title: "All Aims", href: "/all-aims", icon: Target },
    { title: "Completed Tasks", href: "/completedtask", icon: CheckCircle },
     { title: "Leaderboard", href: "/leaderboard", icon: Sparkles },
  ];

  // Admin-only routes
  const adminRoutes = [
    { title: "Employee Monitoring", href: "/monitoring", icon: Monitor },
    { title: "User Management", href: "/user-management", icon: UserCog },
    // { title: "Live Attendance", href: "/attendance-dashboard", icon: Users },
    // { title: "Attendance Analytics", href: "/attendance-analytics", icon: Clock },
    // { title: "Salary Management", href: "/salary-management", icon: DollarSign },
    // { title: "Individual Salaries", href: "/individual-salary-management", icon: UserCog },
  ];

  // User-specific routes
  const userRoutes = [
    { title: "Dashboard", href: "/userdashboard", icon: LayoutDashboardIcon },
    { title: "Progress", href: "/progress", icon: BarChart },
    { title: "Set Aims", href: "/aims", icon: Airplay },
    // { title: "Leave Requests", href: "/leave-request", icon: Calendar },
    { title: "Leaderboard", href: "/leaderboard", icon: Sparkles },
  ];

  // Determine which routes to show based on user role
  let renderRoutes;
  if (user?.role === "User") {
    renderRoutes = userRoutes;
  } else if (user?.role === "Admin") {
    renderRoutes = [...baseRoutes, ...adminRoutes];
  } else {
    renderRoutes = baseRoutes; // For other roles like Manager, etc.
  }

  return (
    <div className="h-full w-80 bg-background/30 backdrop-blur-md border-r border-white/10 relative overflow-hidden">
      {/* Sidebar background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-background/5 to-accent/3 pointer-events-none"></div>
      
      <div className="flex flex-col h-full relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center gap-3 p-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary p-0.5 glow-primary">
            <div className="w-full h-full rounded-lg bg-background/90 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white glow-text">Infiverse</h1>
            <p className="text-xs text-gold/80 font-medium">Cosmic Workspace</p>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 px-3 glow-text-subtle">
              Navigation
            </h2>
            {renderRoutes.map((route) => {
              const Icon = route.icon;
              const active = location.pathname === route.href;
              return (
                <Link
                  key={route.href}
                  to={route.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150 group relative ${
                    active
                      ? "bg-primary/20 text-white border border-primary/30"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors duration-150 ${
                    active ? "text-gold" : "text-white/70 group-hover:text-gold"
                  }`} />
                  <span className="group-hover:text-gold transition-colors duration-150">{route.title}</span>
                  {active && (
                    <div className="absolute right-2 w-2 h-2 bg-gold rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Enhanced Footer */}
        <div className="p-4">
          <div className="space-y-1 mb-4">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 group text-white/70 hover:text-white hover:bg-white/5"
            >
              <Settings className="w-4 h-4 transition-colors duration-150 group-hover:text-gold" />
              <span className="group-hover:text-gold transition-colors duration-150">Settings</span>
            </Link>
          </div>
          
          {/* Enhanced User Profile & Logout */}
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-primary flex items-center justify-center">
                <span className="text-sm font-bold text-background">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                <p className="text-xs text-gold/80">{user?.role || "Employee"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}