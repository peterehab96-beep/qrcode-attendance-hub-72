
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import QrScanner from "@/components/QrScanner";
import ManualEntry from "@/components/ManualEntry";
import { Check, Clock, QrCode, Search } from "lucide-react";
import { Student, AttendanceRecord } from "@/types";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("qr");
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [recordedStatus, setRecordedStatus] = useState<'present' | 'late' | null>(null);
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic
  const { toast } = useToast();

  // Mock function to simulate getting student data from civil ID
  const getStudentByCivilId = async (civilId: string) => {
    setLoading(true);
    setCurrentStudent(null);
    setRecordedStatus(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockStudent: Student = {
      id: "s-" + Math.random().toString(36).substr(2, 9),
      civil_id: civilId,
      name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
      code: "ST" + Math.floor(1000 + Math.random() * 9000),
      class: "10-A",
      grade: "10",
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + civilId,
    };
    
    setCurrentStudent(mockStudent);
    setLoading(false);
    
    // Determine if the student is late based on current time
    const now = new Date();
    const isLate = now.getHours() >= 7 && now.getMinutes() >= 30; // Late after 7:30 AM
    return { student: mockStudent, isLate };
  };

  // Mock function to record attendance
  const recordAttendance = async (civilId: string) => {
    try {
      // Get student info
      const { student, isLate } = await getStudentByCivilId(civilId);
      
      // Record attendance status
      const status = isLate ? "late" : "present";
      setRecordedStatus(status);
      
      // Simulate API call for recording attendance
      // In a real app, this would save to Supabase
      const now = new Date();
      const attendanceRecord: AttendanceRecord = {
        id: "att-" + Math.random().toString(36).substr(2, 9),
        student_id: student.id,
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString(),
        class: student.class,
        status: status as "present" | "late" | "absent",
      };
      
      console.log("Recorded attendance:", attendanceRecord);
      
      // Show success message
      toast({
        title: isArabic 
          ? `${status === "late" ? "تم تسجيل الحضور متأخر" : "تم تسجيل الحضور"}`
          : `Attendance ${status === "late" ? "recorded as late" : "recorded"}`,
        description: isArabic
          ? `${student.name} (${student.code}) - ${new Date().toLocaleTimeString()}`
          : `${student.name} (${student.code}) - ${new Date().toLocaleTimeString()}`,
      });
      
    } catch (error) {
      console.error("Error recording attendance:", error);
      toast({
        variant: "destructive",
        title: isArabic ? "فشل في تسجيل الحضور" : "Failed to record attendance",
        description: isArabic ? "الطالب غير موجود أو خطأ في النظام" : "Student not found or system error",
      });
    }
  };

  const handleQRScan = (civilId: string) => {
    recordAttendance(civilId);
  };

  const handleManualEntry = (civilId: string) => {
    recordAttendance(civilId);
  };

  const handleReset = () => {
    setCurrentStudent(null);
    setRecordedStatus(null);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? "rtl arabic" : ""}`}>
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? "تسجيل الحضور" : "Record Attendance"}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? "امسح رموز QR أو أدخل الرقم المدني لتسجيل حضور الطلاب"
                : "Scan QR codes or enter Civil IDs to record student attendance"
              }
            </p>
          </div>
          
          {/* QR and Manual Entry Tabs */}
          <div className="grid gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr" className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" /> 
                  {isArabic ? "ماسح QR" : "QR Scanner"}
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center">
                  <Search className="mr-2 h-4 w-4" /> 
                  {isArabic ? "إدخال يدوي" : "Manual Entry"}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="qr" className="mt-4">
                <QrScanner onScan={handleQRScan} />
              </TabsContent>
              <TabsContent value="manual" className="mt-4">
                <ManualEntry onSubmit={handleManualEntry} />
              </TabsContent>
            </Tabs>
            
            {/* Attendance Results */}
            {currentStudent && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isArabic ? "معلومات الطالب" : "Student Information"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? "تم تسجيل الحضور للطالب التالي"
                      : "Attendance recorded for the following student"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                      {currentStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentStudent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? `الرمز: ${currentStudent.code} | الرقم المدني: ${currentStudent.civil_id}`
                          : `Code: ${currentStudent.code} | Civil ID: ${currentStudent.civil_id}`
                        }
                      </p>
                      <p className="text-sm">
                        {isArabic 
                          ? `الفصل: ${currentStudent.class} | الصف: ${currentStudent.grade}`
                          : `Class: ${currentStudent.class} | Grade: ${currentStudent.grade}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {recordedStatus && (
                    <Alert className={
                      recordedStatus === "present" 
                        ? "bg-green-50 border-green-200" 
                        : "bg-amber-50 border-amber-200"
                    }>
                      <div className="flex items-center gap-2">
                        {recordedStatus === "present" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                        <AlertTitle>
                          {isArabic 
                            ? `تم تسجيل الحضور ${recordedStatus === "late" ? "- متأخر" : ""}`
                            : `Attendance Recorded ${recordedStatus === "late" ? "- Late" : ""}`
                          }
                        </AlertTitle>
                      </div>
                      <AlertDescription className="mt-1">
                        {recordedStatus === "present" ? (
                          <span className="flex items-center">
                            <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                              {isArabic ? "حاضر" : "Present"}
                            </Badge>
                            {isArabic 
                              ? `تم تسجيل حضور الطالب بنجاح في ${new Date().toLocaleTimeString()}`
                              : `Student attendance recorded successfully at ${new Date().toLocaleTimeString()}`
                            }
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 mr-2">
                              {isArabic ? "متأخر" : "Late"}
                            </Badge>
                            {isArabic 
                              ? `تم تسجيل الطالب متأخراً في ${new Date().toLocaleTimeString()}`
                              : `Student marked late at ${new Date().toLocaleTimeString()}`
                            }
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleReset}>
                      {isArabic ? "تسجيل آخر" : "Record Another"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
