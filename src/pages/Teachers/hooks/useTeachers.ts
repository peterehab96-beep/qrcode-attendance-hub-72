
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Teacher } from "@/types";

export const useTeachers = (searchQuery: string) => {
  const { toast } = useToast();
  
  // بيانات المعلمين - سيتم استبدالها بالبيانات من Supabase لاحقاً
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "t1",
      civil_id: "1234567890",
      name: "أحمد محمد الخالد",
      classes: ["10-أ", "11-ب"]
    },
    {
      id: "t2",
      civil_id: "2345678901",
      name: "سارة عبدالله الفهد",
      classes: ["10-ب", "11-أ"]
    },
    {
      id: "t3",
      civil_id: "3456789012",
      name: "خالد العمر",
      classes: ["12-أ", "12-ب"]
    }
  ]);

  // تصفية المعلمين بناءً على استعلام البحث
  const filteredTeachers = teachers.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(query) ||
      teacher.civil_id.includes(query) ||
      (teacher.classes?.join(" ").toLowerCase() || "").includes(query)
    );
  });

  // إضافة معلم جديد
  const handleAddTeacher = (newTeacherData: Partial<Teacher>) => {
    // التحقق من صحة النموذج
    if (!newTeacherData.civil_id || !newTeacherData.name) {
      toast({
        variant: "destructive",
        title: "معلومات مفقودة",
        description: "يرجى ملء جميع الحقول المطلوبة",
      });
      return;
    }

    const teacher: Teacher = {
      id: "t" + Math.random().toString(36).substr(2, 9),
      civil_id: newTeacherData.civil_id!,
      name: newTeacherData.name!,
      classes: newTeacherData.classes || []
    };

    setTeachers([...teachers, teacher]);
    
    toast({
      title: "تمت إضافة المعلم",
      description: `تمت إضافة ${teacher.name} إلى النظام`,
    });
  };

  // تعديل معلم
  const handleEditTeacher = (updatedTeacher: Teacher) => {
    // التحقق من صحة النموذج
    if (!updatedTeacher.civil_id || !updatedTeacher.name) {
      toast({
        variant: "destructive",
        title: "معلومات مفقودة",
        description: "يرجى ملء جميع الحقول المطلوبة",
      });
      return;
    }

    const updatedTeachers = teachers.map(teacher => 
      teacher.id === updatedTeacher.id ? updatedTeacher : teacher
    );

    setTeachers(updatedTeachers);

    toast({
      title: "تم تعديل المعلم",
      description: `تم تعديل بيانات ${updatedTeacher.name} بنجاح`,
    });
  };

  // حذف معلم
  const handleDeleteTeacher = (id: string) => {
    const teacherToDelete = teachers.find(teacher => teacher.id === id);
    if (!teacherToDelete) return;
    
    const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
    setTeachers(updatedTeachers);

    toast({
      title: "تم حذف المعلم",
      description: `تم حذف ${teacherToDelete.name} من النظام`,
    });
  };

  // تصدير المعلمين كملف CSV
  const handleExportTeachers = () => {
    const headers = ["الرقم التعريفي", "الرقم المدني", "الاسم", "الفصول"];
    const csvData = [
      headers.join(","),
      ...teachers.map(teacher => {
        return [
          teacher.id,
          teacher.civil_id,
          teacher.name,
          teacher.classes?.join(" | ")
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "teachers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم تصدير المعلمين",
      description: "تم تصدير بيانات المعلمين بنجاح",
    });
  };

  return {
    teachers,
    filteredTeachers,
    handleAddTeacher,
    handleEditTeacher,
    handleDeleteTeacher,
    handleExportTeachers
  };
};
