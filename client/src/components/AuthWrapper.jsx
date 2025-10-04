import { Navigate } from "react-router-dom"

export function AuthWrapper({ children }) {
  const user = JSON.parse(localStorage.getItem("WorkflowUser") || "{}")
  const token = localStorage.getItem("WorkflowToken")
  
  // If user is not logged in, redirect to login
  if (!user?.id || !token) {
    return <Navigate to="/login" replace />
  }
  
  // If user is logged in, render the protected content
  return children
}

export function HomeRedirect() {
  // Always redirect to login page after splash screen
  // Users will be redirected to appropriate dashboard after successful login
  return <Navigate to="/login" replace />
}