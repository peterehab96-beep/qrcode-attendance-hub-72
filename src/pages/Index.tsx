
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic
  const navigate = useNavigate();
  const { user, signIn, loading } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? "rtl arabic" : ""}`}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <QrCode className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {isArabic ? "نظام الحضور بالرمز QR" : "QR Attendance System"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "سجل الدخول لإدارة حضور الطلاب"
                  : "Sign in to manage student attendance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {isArabic ? "كلمة المرور" : "Password"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={isArabic ? "أدخل كلمة المرور" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    <LogIn className="mr-2 h-4 w-4" />
                    {isArabic ? "تسجيل الدخول" : "Sign In"}
                  </Button>
                </div>
              </form>
              
              {/* Login credentials hint - Remove in production */}
              <div className="border border-amber-200 bg-amber-50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">{isArabic ? "حسابات تجريبية:" : "Demo Accounts:"}</p>
                <p>{isArabic ? "مدير: principal@school.com / admin" : "Principal: principal@school.com / admin"}</p>
                <p>{isArabic ? "معلم: teacher@school.com / teacher" : "Teacher: teacher@school.com / teacher"}</p>
                <p>{isArabic ? "مساعد: assistant@school.com / assistant" : "Assistant: assistant@school.com / assistant"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={toggleLanguage}
              >
                {isArabic ? "English" : "العربية"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          {isArabic
            ? "نظام حضور الطلاب باستخدام رمز QR © 2025"
            : "QR Code Student Attendance System © 2025"}
        </p>
      </footer>
    </div>
  );
};

export default Index;
