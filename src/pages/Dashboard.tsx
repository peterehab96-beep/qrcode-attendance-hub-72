
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, QrCode, Users } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [isArabic, setIsArabic] = React.useState(true); // Default to Arabic
  
  // Mock data - in real app, this would come from the database
  const stats = {
    totalStudents: 250,
    presentToday: 235,
    lateToday: 10,
    absentToday: 5,
    attendanceRate: "94%",
  };

  // Get current date in a readable format
  const currentDate = new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get user's role and name in Arabic
  const getUserRoleInArabic = () => {
    switch(user?.role) {
      case "principal": return "المدير";
      case "teacher": return "المعلم";
      case "assistant": return "المساعد الإداري";
      default: return "المستخدم";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? "rtl arabic" : ""}`}>
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isArabic ? "لوحة التحكم" : "Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {isArabic 
                  ? `مرحباً بعودتك، ${user?.name || getUserRoleInArabic()}`
                  : `Welcome back, ${user?.name || "User"}`
                }
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
              <Clock className="h-4 w-4 mr-2" />
              <span>{new Date().toLocaleTimeString(isArabic ? "ar-SA" : "en-US")}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "إجمالي الطلاب" : "Total Students"}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "مسجلين في النظام" : "Registered in the system"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "الحاضرون اليوم" : "Present Today"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-present" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.presentToday}</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${Math.round((stats.presentToday / stats.totalStudents) * 100)}% من الطلاب`
                    : `${Math.round((stats.presentToday / stats.totalStudents) * 100)}% of students`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "المتأخرون اليوم" : "Late Today"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-late" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lateToday}</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${Math.round((stats.lateToday / stats.totalStudents) * 100)}% من الطلاب`
                    : `${Math.round((stats.lateToday / stats.totalStudents) * 100)}% of students`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "الغائبون اليوم" : "Absent Today"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-absent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.absentToday}</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${Math.round((stats.absentToday / stats.totalStudents) * 100)}% من الطلاب`
                    : `${Math.round((stats.absentToday / stats.totalStudents) * 100)}% of students`
                  }
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Role-specific content */}
          {user?.role === "principal" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? "نظرة عامة على المدرسة" : "School Overview"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "رؤى إدارية وإدارة النظام"
                    : "Administrative insights and system management"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  {isArabic 
                    ? "بصفتك المدير، يمكنك الوصول إلى جميع ميزات النظام بما في ذلك:"
                    : "As the Principal, you have access to all system features including:"
                  }
                </p>
                <ul className="list-disc pr-5 mt-2 space-y-1">
                  <li>
                    {isArabic 
                      ? "تحميل وإدارة بيانات الطلاب"
                      : "Upload and manage student data"
                    }
                  </li>
                  <li>
                    {isArabic 
                      ? "إضافة وتكليف المعلمين"
                      : "Add and assign teachers"
                    }
                  </li>
                  <li>
                    {isArabic 
                      ? "إنشاء تقارير شاملة للحضور"
                      : "Generate comprehensive attendance reports"
                    }
                  </li>
                  <li>
                    {isArabic 
                      ? "تكوين إعدادات النظام"
                      : "Configure system settings"
                    }
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
          
          {user?.role === "teacher" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? "لوحة تحكم المعلم" : "Teacher Dashboard"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "إدارة فصولك وسجلات الحضور"
                    : "Manage your classes and attendance records"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  {isArabic 
                    ? "بصفتك معلمًا، يمكنك إدارة الحضور للفصول المخصصة لك وعرض سجلات الطلاب وإنشاء تقارير لطلابك."
                    : "As a Teacher, you can manage attendance for your assigned classes, view student records, and generate reports for your students."
                  }
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">
                    {isArabic ? "فصولك:" : "Your Classes:"}
                  </h3>
                  <ul className="grid gap-2">
                    <li className="flex justify-between p-2 bg-muted rounded-md">
                      <span>{isArabic ? "الصف 10 - شعبة أ" : "Grade 10 - Section A"}</span>
                      <span className="text-sm text-muted-foreground">
                        {isArabic ? "25 طالب" : "25 students"}
                      </span>
                    </li>
                    <li className="flex justify-between p-2 bg-muted rounded-md">
                      <span>{isArabic ? "الصف 10 - شعبة ب" : "Grade 10 - Section B"}</span>
                      <span className="text-sm text-muted-foreground">
                        {isArabic ? "28 طالب" : "28 students"}
                      </span>
                    </li>
                    <li className="flex justify-between p-2 bg-muted rounded-md">
                      <span>{isArabic ? "الصف 11 - شعبة أ" : "Grade 11 - Section A"}</span>
                      <span className="text-sm text-muted-foreground">
                        {isArabic ? "23 طالب" : "23 students"}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
          
          {user?.role === "assistant" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? "مساعد الحضور" : "Attendance Assistant"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "تسجيل حضور الطلاب وإدارة السجلات اليومية"
                    : "Record student attendance and manage daily records"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <QrCode className="h-16 w-16 text-primary mb-4" />
                <p className="mb-4">
                  {isArabic 
                    ? "بصفتك مساعدًا، يمكنك تسجيل حضور الطلاب باستخدام مسح رمز QR أو إدخال الرقم المدني يدويًا."
                    : "As an Assistant, you can record student attendance using QR code scanning or manual Civil ID entry."
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? "انتقل إلى صفحة الحضور لبدء تسجيل حضور الطلاب لهذا اليوم."
                    : "Go to the Attendance page to begin recording student attendance for today."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
