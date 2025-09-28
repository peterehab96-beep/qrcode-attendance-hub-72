
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Create font link element for Arabic font
const addArabicFont = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
  document.head.appendChild(link);
};

const queryClient = new QueryClient();

// مكون حماية المسارات مع التحقق من الصلاحيات
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAction: string;
  subject: string;
}

const ProtectedRoute = ({ children, requiredAction, subject }: ProtectedRouteProps) => {
  const { user, loading, can } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">جار التحميل...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!can(requiredAction, subject)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requiredAction="view" subject="dashboard">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute requiredAction="view" subject="attendance">
          <Attendance />
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute requiredAction="view" subject="students">
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/teachers" element={
        <ProtectedRoute requiredAction="view" subject="teachers">
          <Teachers />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute requiredAction="view" subject="reports">
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute requiredAction="view" subject="settings">
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Add Arabic font when the app loads
  useEffect(() => {
    addArabicFont();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
