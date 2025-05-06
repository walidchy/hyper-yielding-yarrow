
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import Members from "./pages/Members";
import Enfants from "./pages/Enfants";
import Anachids from "./pages/Anachids";
import Phases from "./pages/Phases";
import Teams from "./pages/Teams";
import Posts from "./pages/Posts";
import CarteTechnique from "./pages/CarteTechnique";
import Hobbies from "./pages/Hobbies";
import Verifications from "./pages/Verifications";
import Maladies from "./pages/Maladies";
import Transactions from "./pages/Transactions";
import ForgotPassword from "./pages/ForgotPassword";

// Configure QueryClient to only show success messages
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Silent error and warning messages, only show success
      retry: false,
      refetchOnWindowFocus: false
    },
    mutations: {
      // Silent error and warning messages, only show success
      retry: false
    }
  }
});

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App component with auth context for proper nesting
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/anachids" 
        element={
          <ProtectedRoute>
            <Anachids />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/programs" 
        element={
          <ProtectedRoute>
            <Programs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/members" 
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enfants" 
        element={
          <ProtectedRoute>
            <Enfants />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/phases" 
        element={
          <ProtectedRoute>
            <Phases />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teams" 
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/posts" 
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cartes-techniques" 
        element={
          <ProtectedRoute>
            <CarteTechnique />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hobbies" 
        element={
          <ProtectedRoute>
            <Hobbies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verifications" 
        element={
          <ProtectedRoute>
            <Verifications />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/maladies" 
        element={
          <ProtectedRoute>
            <Maladies />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      
      {/* Root route */}
      <Route path="/" element={<Index />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TooltipProvider>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </React.StrictMode>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
