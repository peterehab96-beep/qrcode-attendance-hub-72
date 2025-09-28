
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { User, AuthContextType } from "@/types";
import { checkPermission } from "@/utils/permissions";

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development until Supabase is integrated
const MOCK_USERS = {
  principal: {
    id: "1",
    email: "principal@school.com",
    role: "principal" as const,
    name: "أحمد المنصور",
  },
  teacher: {
    id: "2",
    email: "teacher@school.com",
    role: "teacher" as const,
    name: "سارة القاسمي",
  },
  assistant: {
    id: "3",
    email: "assistant@school.com",
    role: "assistant" as const,
    name: "خالد الفارسي",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("qr_attendance_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // وظيفة للتحقق من الصلاحيات
  const can = (action: string, subject: string): boolean => {
    return checkPermission(user, action, subject);
  };

  // Mock sign in function (replace with Supabase auth)
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in real app, this would use Supabase auth
      const lowercaseEmail = email.toLowerCase();
      let userData: User | null = null;
      
      if (lowercaseEmail === "principal@school.com" && password === "admin") {
        userData = MOCK_USERS.principal;
      } else if (lowercaseEmail === "teacher@school.com" && password === "teacher") {
        userData = MOCK_USERS.teacher;
      } else if (lowercaseEmail === "assistant@school.com" && password === "assistant") {
        userData = MOCK_USERS.assistant;
      }
      
      if (userData) {
        setUser(userData);
        localStorage.setItem("qr_attendance_user", JSON.stringify(userData));
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً، ${userData.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول",
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem("qr_attendance_user");
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "تم تسجيل خروجك من النظام",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
      });
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
