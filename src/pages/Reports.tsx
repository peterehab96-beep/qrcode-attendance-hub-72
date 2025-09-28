
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { AttendanceStats } from "@/types";

const Reports = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [dateRange, setDateRange] = useState("week");
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic

  // Mock data - in real app, this would come from Supabase
  const attendanceData = [
    {
      id: "1",
      student_name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
      student_id: "ST1001",
      civil_id: "1234567890",
      class: "10-A",
      present: 18,
      late: 1,
      absent: 1,
      total: 20,
    },
    {
      id: "2",
      student_name: isArabic ? "سارة عبدالله" : "Sara Abdullah",
      student_id: "ST1002",
      civil_id: "2345678901",
      class: "10-B",
      present: 17,
      late: 2,
      absent: 1,
      total: 20,
    },
    {
      id: "3",
      student_name: isArabic ? "خالد الفهد" : "Khalid Al-Fahad",
      student_id: "ST1003",
      civil_id: "3456789012",
      class: "11-A",
      present: 19,
      late: 0,
      absent: 1,
      total: 20,
    },
    {
      id: "4",
      student_name: isArabic ? "فاطمة السالم" : "Fatima Al-Salem",
      student_id: "ST1004",
      civil_id: "4567890123",
      class: "11-B",
      present: 16,
      late: 3,
      absent: 1,
      total: 20,
    },
    {
      id: "5",
      student_name: isArabic ? "محمد الحسن" : "Mohammed Al-Hassan",
      student_id: "ST1005",
      civil_id: "5678901234",
      class: "12-A",
      present: 15,
      late: 2,
      absent: 3,
      total: 20,
    },
  ];

  // Filter data based on search and class
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.civil_id.includes(searchQuery);

    const matchesClass = selectedClass === "all" || item.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  // Calculate overall stats
  const calculateStats = (): AttendanceStats => {
    const stats = filteredData.reduce(
      (acc, curr) => {
        acc.present += curr.present;
        acc.late += curr.late;
        acc.absent += curr.absent;
        acc.total += curr.total;
        return acc;
      },
      { present: 0, late: 0, absent: 0, total: 0 }
    );
    return stats;
  };

  const stats = calculateStats();

  // Date range for reports
  const getDateRangeText = () => {
    const today = new Date();
    const locale = isArabic ? "ar-SA" : "en-US";
    
    switch (dateRange) {
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString(locale)} - ${weekEnd.toLocaleDateString(locale)}`;
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${monthStart.toLocaleDateString(locale)} - ${monthEnd.toLocaleDateString(locale)}`;
      case "semester":
        return isArabic ? "الفصل الدراسي الحالي" : "Current Semester";
      default:
        return isArabic ? "نطاق مخصص" : "Custom Range";
    }
  };

  // Mock export function
  const handleExport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    window.alert(
      isArabic
        ? `سيتم تصدير التقرير بتنسيق ${format}. سيتم تنفيذ هذه الميزة بالكامل مع Supabase.`
        : `Report will be exported in ${format} format. This feature will be implemented fully with Supabase.`
    );
  };

  // Check if user has permission to access this page
  if (user?.role !== "principal" && user?.role !== "teacher") {
    return (
      <div className={`min-h-screen flex flex-col ${isArabic ? "rtl arabic" : ""}`}>
        <Navbar />
        <div className="flex-1 container py-6 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? "تم رفض الوصول" : "Access Denied"}</CardTitle>
              <CardDescription>
                {isArabic 
                  ? "ليس لديك إذن للوصول إلى هذه الصفحة."
                  : "You don't have permission to access this page."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {isArabic 
                  ? "هذه الصفحة مخصصة للمدير والمعلمين فقط."
                  : "This page is restricted to Principal and Teacher access only."
                }
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard">
                  {isArabic ? "العودة إلى لوحة التحكم" : "Return to Dashboard"}
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? "rtl arabic" : ""}`}>
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? "تقارير الحضور" : "Attendance Reports"}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? "عرض وتحليل بيانات حضور الطلاب"
                : "View and analyze student attendance data"
              }
            </p>
          </div>
          
          {/* Report Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {isArabic ? "خيارات التقرير" : "Report Options"}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? "حدد النطاق الزمني والمرشحات لتقريرك"
                  : "Select date range and filters for your report"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="date-range">
                    {isArabic ? "النطاق الزمني" : "Date Range"}
                  </Label>
                  <Select
                    value={dateRange}
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder={isArabic ? "حدد النطاق الزمني" : "Select date range"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">{isArabic ? "هذا الأسبوع" : "This Week"}</SelectItem>
                      <SelectItem value="month">{isArabic ? "هذا الشهر" : "This Month"}</SelectItem>
                      <SelectItem value="semester">{isArabic ? "هذا الفصل الدراسي" : "This Semester"}</SelectItem>
                      <SelectItem value="custom">{isArabic ? "نطاق مخصص" : "Custom Range"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getDateRangeText()}
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="class-filter">
                    {isArabic ? "الفصل" : "Class"}
                  </Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="class-filter">
                      <SelectValue placeholder={isArabic ? "حدد الفصل" : "Select class"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isArabic ? "كل الفصول" : "All Classes"}</SelectItem>
                      <SelectItem value="10-A">10-A</SelectItem>
                      <SelectItem value="10-B">10-B</SelectItem>
                      <SelectItem value="11-A">11-A</SelectItem>
                      <SelectItem value="11-B">11-B</SelectItem>
                      <SelectItem value="12-A">12-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="search-student">
                    {isArabic ? "بحث عن طالب" : "Search Student"}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-student"
                      placeholder={isArabic ? "الاسم، الرمز أو الرقم المدني" : "Name, ID or Civil ID"}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "إجمالي الحضور" : "Total Attendance"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((stats.present / stats.total) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${stats.present} من أصل ${stats.total} يوم`
                    : `${stats.present} out of ${stats.total} days`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "حاضر" : "Present"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-present" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.present}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${((stats.present / stats.total) * 100).toFixed(1)}% من الأيام`
                    : `${((stats.present / stats.total) * 100).toFixed(1)}% of days`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "متأخر" : "Late"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-late" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.late}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${((stats.late / stats.total) * 100).toFixed(1)}% من الأيام`
                    : `${((stats.late / stats.total) * 100).toFixed(1)}% of days`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? "غائب" : "Absent"}
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-attendance-absent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.absent}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? `${((stats.absent / stats.total) * 100).toFixed(1)}% من الأيام`
                    : `${((stats.absent / stats.total) * 100).toFixed(1)}% of days`
                  }
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Report Tabs */}
          <Tabs defaultValue="list">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="list">
                  {isArabic ? "عرض القائمة" : "List View"}
                </TabsTrigger>
                <TabsTrigger value="summary">
                  {isArabic ? "الملخص" : "Summary"}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("pdf")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isArabic ? "تصدير PDF" : "Export PDF"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("excel")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isArabic ? "تصدير Excel" : "Export Excel"}
                </Button>
              </div>
            </div>
            
            <TabsContent value="list" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isArabic ? "تقرير حضور الطلاب" : "Student Attendance Report"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? `سجلات الحضور التفصيلية ${selectedClass === "all" ? "لجميع الفصول" : `للفصل ${selectedClass}`}`
                      : `Detailed attendance records for ${selectedClass === "all" ? "all classes" : `class ${selectedClass}`}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {isArabic ? "الطالب" : "Student"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "الرمز" : "ID"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "الرقم المدني" : "Civil ID"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "الفصل" : "Class"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "حاضر" : "Present"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "متأخر" : "Late"}
                          </TableHead>
                          <TableHead>
                            {isArabic ? "غائب" : "Absent"}
                          </TableHead>
                          <TableHead className="text-right">
                            {isArabic ? "النسبة" : "Rate"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {item.student_name}
                                </div>
                              </TableCell>
                              <TableCell>{item.student_id}</TableCell>
                              <TableCell>{item.civil_id}</TableCell>
                              <TableCell>{item.class}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {item.present}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  {item.late}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {item.absent}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`font-medium ${
                                  (item.present / item.total) * 100 >= 90
                                    ? "text-green-600"
                                    : (item.present / item.total) * 100 >= 75
                                    ? "text-amber-600"
                                    : "text-red-600"
                                }`}>
                                  {((item.present / item.total) * 100).toFixed(0)}%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              {isArabic ? "لم يتم العثور على سجلات حضور" : "No attendance records found"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div>
                    <Calendar className="inline-block mr-1 h-4 w-4" />
                    {getDateRangeText()}
                  </div>
                  <div>
                    {isArabic 
                      ? `عرض ${filteredData.length} من ${attendanceData.length} طالب`
                      : `Showing ${filteredData.length} of ${attendanceData.length} students`
                    }
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isArabic ? "ملخص الحضور" : "Attendance Summary"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? "نظرة عامة على إحصائيات الحضور" : "Overview of attendance statistics"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {((stats.present / stats.total) * 100).toFixed(1)}%
                      </div>
                      <p className="text-muted-foreground">
                        {isArabic ? "معدل الحضور الإجمالي" : "Overall attendance rate"}
                      </p>
                    </div>
                    
                    <div className="w-full max-w-md grid gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isArabic ? "حاضر:" : "Present:"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-attendance-present" 
                              style={{ width: `${(stats.present / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm">{((stats.present / stats.total) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isArabic ? "متأخر:" : "Late:"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-attendance-late" 
                              style={{ width: `${(stats.late / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm">{((stats.late / stats.total) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isArabic ? "غائب:" : "Absent:"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-attendance-absent" 
                              style={{ width: `${(stats.absent / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm">{((stats.absent / stats.total) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-center max-w-md">
                      <p>
                        {isArabic 
                          ? `يغطي ملخص الحضور هذا ${selectedClass === "all" ? "جميع الفصول" : `الفصل ${selectedClass}`} للفترة: ${getDateRangeText()}`
                          : `This attendance summary covers ${selectedClass === "all" ? "all classes" : `class ${selectedClass}`} for the period: ${getDateRangeText()}`
                        }
                      </p>
                      <p className="mt-2 text-muted-foreground">
                        {isArabic 
                          ? `إجمالي الأيام المتتبعة: ${stats.total} | الطلاب: ${filteredData.length}`
                          : `Total days tracked: ${stats.total} | Students: ${filteredData.length}`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;
