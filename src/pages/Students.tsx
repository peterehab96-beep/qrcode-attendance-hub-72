import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Download,
  Edit,
  FilePlus,
  Printer,
  QrCode,
  Search,
  Trash,
  Upload,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StudentCard from "@/components/StudentCard";
import { useAuth } from "@/context/AuthContext";
import { ExcelStudent, SchoolSettings, Student } from "@/types";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const Students = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic
  const [students, setStudents] = useState<Student[]>([
    {
      id: "s1",
      civil_id: "1234567890",
      name: "أحمد محمد",
      code: "ST1001",
      class: "10-أ",
      grade: "العاشر",
      specialization: "علمي",
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=1234567890",
    },
    {
      id: "s2",
      civil_id: "2345678901",
      name: "سارة عبدالله",
      code: "ST1002",
      class: "11-ب",
      grade: "الحادي عشر",
      specialization: "أدبي",
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=2345678901",
    },
    {
      id: "s3",
      civil_id: "3456789012",
      name: "خالد الفهد",
      code: "ST1003",
      class: "12-ج",
      grade: "الثاني عشر",
      specialization: "علمي",
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=3456789012",
    },
  ]);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    civil_id: "",
    grade: "العاشر",
    class: "",
    specialization: "علمي",
  });

  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const savedSettings = localStorage.getItem("school_settings");
    return savedSettings ? JSON.parse(savedSettings) : {
      schoolName: "مدرسة النهضة الثانوية",
      schoolAddress: "شارع الملك فهد، الرياض",
      schoolPhone: "0112345678",
      schoolEmail: "info@school.edu.sa",
      grades: ["العاشر", "الحادي عشر", "الثاني عشر"],
      sections: ["أ", "ب", "ج"],
      specializations: ["علمي", "أدبي"],
    };
  });

  const filteredStudents = students.filter((student) => {
    return (
      student.name.includes(searchQuery) ||
      student.civil_id.includes(searchQuery) ||
      student.code.includes(searchQuery)
    );
  });

  const handleCreateStudent = () => {
    if (!newStudent.name || !newStudent.civil_id || !newStudent.grade) {
      toast({
        variant: "destructive",
        title: "بيانات غير مكتملة",
        description: "الرجاء إدخال جميع البيانات المطلوبة للطالب",
      });
      return;
    }

    const studentCode = `ST${Math.floor(1000 + Math.random() * 9000)}`;
    
    const qrData = `${newStudent.civil_id}-${newStudent.name}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    // Fix the TypeScript error by explicitly checking the type
    let specialization: "علمي" | "أدبي" = "علمي";
    if (newStudent.specialization === "علمي" || newStudent.specialization === "أدبي") {
      specialization = newStudent.specialization;
    }
    
    const student: Student = {
      id: `s-${Math.random().toString(36).substr(2, 9)}`,
      civil_id: newStudent.civil_id || "",
      name: newStudent.name || "",
      code: studentCode,
      grade: newStudent.grade || "العاشر",
      class: `${newStudent.grade}-${newStudent.class || "أ"}`,
      specialization: specialization,
      qr_code: qrCode,
    };
    
    setStudents((prev) => [...prev, student]);
    
    setNewStudent({
      name: "",
      civil_id: "",
      grade: "العاشر",
      class: "أ",
      specialization: "علمي",
    });
    
    toast({
      title: "تم إنشاء الطالب بنجاح",
      description: `تم إضافة الطالب ${student.name} إلى النظام`,
    });
  };

  const handlePrintCard = (student: Student) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [85, 55],
    });
    
    try {
      doc.addFileToVFS("Cairo-normal.ttf", "https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.woff");
      doc.addFont("Cairo-normal.ttf", "Cairo", "normal");
      doc.setFont("Cairo");
      
      doc.setFontSize(10);
      
      doc.setFontSize(12);
      doc.text(schoolSettings.schoolName, 42.5, 7, { align: "center" });
      doc.setFontSize(8);
      doc.text("بطاقة الطالب", 42.5, 12, { align: "center" });
      
      doc.setFontSize(10);
      doc.text(student.name, 42.5, 20, { align: "center" });
      
      const section = student.class ? (student.class.includes('-') ? student.class.split('-')[1] : student.class) : '';
      
      doc.setFontSize(8);
      doc.text(`الرقم المدني: ${student.civil_id}`, 70, 27, { align: "right" });
      doc.text(`الصف: ${student.grade}`, 70, 32, { align: "right" });
      doc.text(`الشعبة: ${section}`, 70, 37, { align: "right" });
      doc.text(`التخصص: ${student.specialization || "غير محدد"}`, 70, 42, { align: "right" });
      doc.text(`الرمز: ${student.code}`, 70, 47, { align: "right" });

      if (student.qr_code) {
        const img = new Image();
        img.src = student.qr_code;
        
        img.onload = function() {
          try {
            doc.addImage(img, 'PNG', 5, 25, 25, 25);
            doc.save(`بطاقة_الطالب_${student.name}.pdf`);
          } catch (error) {
            console.error("Failed to add QR image:", error);
            doc.save(`بطاقة_الطالب_${student.name}.pdf`);
          }
        };
        
        img.onerror = function() {
          console.error("Failed to load QR image");
          doc.save(`بطاقة_الطالب_${student.name}.pdf`);
        };
      } else {
        doc.save(`بطاقة_الطالب_${student.name}.pdf`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الطباعة",
        description: "حدث خطأ أثناء إنشاء بطاقة الطالب",
      });
    }
  };

  const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const excelData = XLSX.utils.sheet_to_json<ExcelStudent>(worksheet);
        
        const newStudents: Student[] = excelData.map((row) => {
          const qrData = `${row.civil_id}-${row.name}`;
          const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
          
          // Fix the TypeScript error by explicitly checking the type
          let specialization: "علمي" | "أدبي" = "علمي";
          if (row.specialization === "علمي" || row.specialization === "أدبي") {
            specialization = row.specialization as "علمي" | "أدبي";
          }
          
          return {
            id: `s-${Math.random().toString(36).substr(2, 9)}`,
            civil_id: row.civil_id,
            name: row.name,
            code: `ST${Math.floor(1000 + Math.random() * 9000)}`,
            grade: row.grade,
            class: `${row.grade}-${row.section}`,
            specialization: specialization,
            qr_code: qrCode,
          };
        });
        
        setStudents((prev) => [...prev, ...newStudents]);
        
        toast({
          title: "تم استيراد البيانات بنجاح",
          description: `تمت إضافة ${newStudents.length} طالب من ملف Excel`,
        });
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الملف",
          description: "حدث خطأ أثناء معالجة ملف Excel. تأكد من صحة تنسيق الملف.",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: "اسم الطالب",
        civil_id: "الرقم المدني",
        grade: "الصف",
        section: "الشعبة",
        specialization: "التخصص",
      },
      {
        name: "أحمد محمد",
        civil_id: "1234567890",
        grade: "العاشر",
        section: "أ",
        specialization: "علمي",
      },
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    
    XLSX.utils.book_append_sheet(wb, ws, "قالب_الطلاب");
    
    XLSX.writeFile(wb, "قالب_بيانات_الطلاب.xlsx");
  };

  const handleExportToExcel = () => {
    const exportData = students.map(student => ({
      "اسم الطالب": student.name,
      "الرقم المدني": student.civil_id,
      "الرمز": student.code,
      "الصف": student.grade,
      "الشعبة": student.class.split('-')[1],
      "التخصص": student.specialization || "غير محدد",
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    XLSX.utils.book_append_sheet(wb, ws, "بيانات_الطلاب");
    
    XLSX.writeFile(wb, "بيانات_الطلاب.xlsx");
  };

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
      setStudentToDelete(null);
      
      toast({
        title: "تم حذف الطالب",
        description: `تم حذف بيانات الطالب ${studentToDelete.name} بنجاح`,
      });
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent({...student});
  };

  const saveEditedStudent = () => {
    if (editingStudent) {
      // Fix the TypeScript error by explicitly checking the type
      let specialization: "علمي" | "أدبي" | undefined = undefined;
      if (editingStudent.specialization === "علمي" || editingStudent.specialization === "أدبي") {
        specialization = editingStudent.specialization;
      }
      
      const updatedStudent = {
        ...editingStudent,
        specialization: specialization
      };
      
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      
      toast({
        title: "تم تحديث البيانات",
        description: `تم تحديث بيانات الطالب ${updatedStudent.name} بنجاح`,
      });
      
      setEditingStudent(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col rtl arabic">
        <Navbar />
        <div className="flex-1 container py-6 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>لم يتم تسجيل الدخول</CardTitle>
              <CardDescription>
                يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                هذه الصفحة تتطلب تسجيل الدخول.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/">
                  العودة إلى الصفحة الرئيسية
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (user.role !== "principal" && user.role !== "teacher") {
    return (
      <div className="min-h-screen flex flex-col rtl arabic">
        <Navbar />
        <div className="flex-1 container py-6 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>تم رفض الوصول</CardTitle>
              <CardDescription>
                ليس لديك إذن للوصول إلى هذه الصفحة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                هذه الصفحة مخصصة للمدير والمعلمين فقط.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard">
                  العودة إلى لوحة التحكم
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col rtl arabic">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                إدارة الطلاب
              </h1>
              <p className="text-muted-foreground">
                إضافة وتعديل بيانات الطلاب وطباعة بطاقاتهم
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    إضافة طالب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة طالب جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الطالب الجديد. سيتم إنشاء رمز QR تلقائياً.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="student-name">اسم الطالب</Label>
                      <Input
                        id="student-name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="civil-id">الرقم المدني</Label>
                      <Input
                        id="civil-id"
                        value={newStudent.civil_id}
                        onChange={(e) => setNewStudent({...newStudent, civil_id: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="grade">الصف</Label>
                      <Select
                        value={newStudent.grade}
                        onValueChange={(value) => setNewStudent({...newStudent, grade: value})}
                      >
                        <SelectTrigger id="grade">
                          <SelectValue placeholder="اختر الصف" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolSettings.grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="section">الشعبة</Label>
                      <Select
                        value={newStudent.class}
                        onValueChange={(value) => setNewStudent({...newStudent, class: value})}
                      >
                        <SelectTrigger id="section">
                          <SelectValue placeholder="اختر الشعبة" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolSettings.sections.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="specialization">التخصص</Label>
                      <Select
                        value={newStudent.specialization}
                        onValueChange={(value) => {
                          // Ensure the value is of the correct type
                          let specialization: "علمي" | "أدبي" | undefined = undefined;
                          if (value === "علمي" || value === "أدبي") {
                            specialization = value;
                          }
                          
                          setNewStudent({
                            ...newStudent, 
                            specialization
                          });
                        }}
                      >
                        <SelectTrigger id="specialization">
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolSettings.specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleCreateStudent}>إضافة الطالب</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    استيراد من Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>استيراد بيانات الطلاب</DialogTitle>
                    <DialogDescription>
                      قم بتحميل ملف Excel يحتوي على بيانات الطلاب.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      يجب أن يحتوي الملف على الأعمدة التالية: name, civil_id, grade, section, specialization
                    </p>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="excel-file">ملف Excel</Label>
                      <Input
                        id="excel-file"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleUploadExcel}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="h-4 w-4" />
                      تنزيل قالب Excel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportToExcel}
              >
                <Download className="h-4 w-4" />
                تصدير البيانات
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن طالب بالاسم أو الرقم المدني أو الرمز..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">قائمة الطلاب</CardTitle>
              <CardDescription>
                {filteredStudents.length} طالب مسجل في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الرقم المدني</TableHead>
                      <TableHead className="text-right">الرمز</TableHead>
                      <TableHead className="text-right">الصف</TableHead>
                      <TableHead className="text-right">الشعبة</TableHead>
                      <TableHead className="text-right">التخصص</TableHead>
                      <TableHead className="text-center w-[140px]">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.civil_id}</TableCell>
                          <TableCell>{student.code}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.class.split('-')[1] || student.class}</TableCell>
                          <TableCell>{student.specialization || "غير محدد"}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePrintCard(student)}
                                title="طباعة البطاقة"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedStudent(student)}
                                title="عرض بطاقة الطالب"
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditStudent(student)}
                                title="ت��ديل بيانات الطالب"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStudent(student)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                                title="حذف الطالب"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          لم يتم العثور على طلاب مطابقين
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">بطاقة الطالب</DialogTitle>
            </DialogHeader>
            {selectedStudent && <StudentCard student={selectedStudent} />}
            <DialogFooter>
              {selectedStudent && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handlePrintCard(selectedStudent)}
                >
                  <Printer className="h-4 w-4" />
                  طباعة البطاقة
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل بيانات الطالب</DialogTitle>
              <DialogDescription>
                قم بتعديل معلومات الطالب
              </DialogDescription>
            </DialogHeader>
            
            {editingStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">اسم الطالب</Label>
                  <Input
                    id="edit-name"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-civil-id">الرقم المدني</Label>
                  <Input
                    id="edit-civil-id"
                    value={editingStudent.civil_id}
                    onChange={(e) => setEditingStudent({...editingStudent, civil_id: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-grade">الصف</Label>
                  <Select
                    value={editingStudent.grade}
                    onValueChange={(value) => setEditingStudent({...editingStudent, grade: value})}
                  >
                    <SelectTrigger id="edit-grade">
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolSettings.grades.map((grade) => (
                        <SelectItem key={`edit-${grade}`} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-section">الشعبة</Label>
                  <Select
                    value={editingStudent.class.split('-')[1] || editingStudent.class}
                    onValueChange={(value) => setEditingStudent({
                      ...editingStudent, 
                      class: `${editingStudent.grade}-${value}`
                    })}
                  >
                    <SelectTrigger id="edit-section">
                      <SelectValue placeholder="اختر الشعبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolSettings.sections.map((section) => (
                        <SelectItem key={`edit-section-${section}`} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-specialization">التخصص</Label>
                  <Select
                    value={editingStudent.specialization}
                    onValueChange={(value: "علمي" | "أدبي") => setEditingStudent({
                      ...editingStudent, 
                      specialization: value
                    })}
                  >
                    <SelectTrigger id="edit-specialization">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolSettings.specializations.map((spec) => (
                        <SelectItem key={`edit-spec-${spec}`} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingStudent(null)}>إلغاء</Button>
              <Button onClick={saveEditedStudent} disabled={!editingStudent}>حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف الطالب</AlertDialogTitle>
              <AlertDialogDescription>
                {studentToDelete && (
                  <>
                    هل أنت متأكد من رغبتك في حذف بيانات الطالب 
                    "{studentToDelete.name}"؟
                    <br />
                    هذا الإجراء لا يمكن التراجع عنه.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-between">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteStudent}
                className="bg-destructive hover:bg-destructive/90"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Students;
