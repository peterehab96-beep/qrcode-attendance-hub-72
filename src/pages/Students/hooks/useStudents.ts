import { useState } from "react";
import { Student } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";

export const useStudents = () => {
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
  ]);

  // Add a new student and return boolean success indicator
  const addStudent = (studentData: Partial<Student>): boolean => {
    try {
      if (!studentData.name || !studentData.civil_id) {
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "الرجاء إدخال جميع البيانات المطلوبة للطالب",
        });
        return false;
      }

      // Generate code if not provided
      const studentCode = studentData.code || `ST${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Generate QR code
      const qrData = `${studentData.civil_id}-${studentData.name}`;
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
      
      // Ensure specialization is valid
      let specialization: "علمي" | "أدبي" = "علمي";
      if (studentData.specialization === "علمي" || studentData.specialization === "أدبي") {
        specialization = studentData.specialization;
      }
      
      // Create new student
      const newStudent: Student = {
        id: `s-${Math.random().toString(36).substr(2, 9)}`,
        civil_id: studentData.civil_id,
        name: studentData.name,
        code: studentCode,
        grade: studentData.grade || "العاشر",
        class: studentData.class || "10-أ",
        specialization: specialization,
        qr_code: qrCode,
      };
      
      setStudents(prev => [...prev, newStudent]);
      
      toast({
        title: "تم إنشاء الطالب بنجاح",
        description: `تم إضافة الطالب ${newStudent.name} إلى النظام`,
      });
      
      return true;
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        variant: "destructive",
        title: "خطأ في إضافة الطالب",
        description: "حدث خطأ أثناء محاولة إضافة الطالب",
      });
      return false;
    }
  };

  // Update a student and return boolean success indicator
  const updateStudent = (updatedStudent: Student): boolean => {
    try {
      // Ensure specialization is valid
      let specialization: "علمي" | "أدبي" = "علمي";
      if (updatedStudent.specialization === "علمي" || updatedStudent.specialization === "أدبي") {
        specialization = updatedStudent.specialization;
      }
      
      const studentToUpdate = {
        ...updatedStudent,
        specialization: specialization,
      };
      
      setStudents(prev => 
        prev.map(student => 
          student.id === studentToUpdate.id ? studentToUpdate : student
        )
      );
      
      toast({
        title: "تم تحديث البيانات",
        description: `تم تحديث بيانات الطالب ${studentToUpdate.name} بنجاح`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحديث البيانات",
        description: "حدث خطأ أثناء محاولة تحديث بيانات الطالب",
      });
      return false;
    }
  };

  // Delete a student
  const deleteStudent = (id: string): void => {
    setStudents(prev => prev.filter(student => student.id !== id));
    
    toast({
      title: "تم حذف الطالب",
      description: "تم حذف بيانات الطالب بنجاح",
    });
  };

  // Print a student card
  const printStudentCard = (student: Student): void => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [85, 55],
      });
      
      // Add Cairo font for Arabic support
      doc.addFileToVFS("Cairo-normal.ttf", "https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.woff");
      doc.addFont("Cairo-normal.ttf", "Cairo", "normal");
      doc.setFont("Cairo");
      
      // Set up document
      doc.setFontSize(10);
      doc.setFontSize(12);
      doc.text("مدرسة النهضة الثانوية", 42.5, 7, { align: "center" });
      doc.setFontSize(8);
      doc.text("بطاقة الطالب", 42.5, 12, { align: "center" });
      
      doc.setFontSize(10);
      doc.text(student.name, 42.5, 20, { align: "center" });
      
      // Extract section from class field
      const section = student.class ? (student.class.includes('-') ? student.class.split('-')[1] : student.class) : '';
      
      // Student details
      doc.setFontSize(8);
      doc.text(`الرقم المدني: ${student.civil_id}`, 70, 27, { align: "right" });
      doc.text(`الصف: ${student.grade}`, 70, 32, { align: "right" });
      doc.text(`الشعبة: ${section}`, 70, 37, { align: "right" });
      doc.text(`التخصص: ${student.specialization || "غير محدد"}`, 70, 42, { align: "right" });
      doc.text(`الرمز: ${student.code}`, 70, 47, { align: "right" });

      // Add QR code if available
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

  // Bulk upload students
  const bulkUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.click();
    
    // Logic would be implemented here
    toast({
      title: "تحميل الملف",
      description: "تم تفعيل نافذة تحميل الملف",
    });
  };

  // Export students to Excel
  const exportStudents = () => {
    // Logic would be implemented here
    toast({
      title: "تصدير البيانات",
      description: "جاري تصدير بيانات الطلاب",
    });
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    printStudentCard,
    bulkUpload,
    exportStudents,
  };
};
