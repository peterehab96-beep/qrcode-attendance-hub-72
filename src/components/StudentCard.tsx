
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, User } from "lucide-react";
import { Student } from "@/types";
import { jsPDF } from "jspdf";
import { toast } from "@/components/ui/use-toast";

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const handlePrint = () => {
    if (!student) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لا توجد بيانات للطالب",
      });
      return;
    }

    // الحصول على إعدادات المدرسة من التخزين المحلي
    const savedSettings = localStorage.getItem("school_settings");
    const schoolSettings = savedSettings ? JSON.parse(savedSettings) : {
      schoolName: "مدرسة النهضة الثانوية",
    };
    
    try {
      // إنشاء مستند PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [85, 55], // حجم بطاقة ID قياسية
      });
      
      // Add white background and rounded corners
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(0, 0, 85, 55, 3, 3, 'FD');
      
      // Add red header
      doc.setFillColor(220, 53, 69); // Red header color
      doc.rect(0, 0, 85, 10, 'F');
      
      // Set text in white color for header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(schoolSettings.schoolName, 42.5, 6, { align: "center" });
      
      // Set text color back to black for body
      doc.setTextColor(0, 0, 0);
      
      // Add student photo placeholder (circle)
      doc.setFillColor(240, 240, 240);
      doc.circle(25, 25, 10, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.circle(25, 25, 10, 'S');
      
      // Add student information (right-aligned)
      doc.setFontSize(10);
      doc.text(`${student.name}`, 75, 20, { align: "right" });
      doc.text(`${student.civil_id}`, 75, 27, { align: "right" });
      doc.text(`${student.grade}`, 75, 34, { align: "right" });
      
      const section = student.class.includes('-') ? student.class.split('-')[1] : student.class;
      doc.text(`${section}`, 75, 41, { align: "right" });
      
      if (student.specialization) {
        doc.text(`${student.specialization}`, 75, 48, { align: "right" });
      }
      
      // Add QR code if available - placed at bottom left corner
      if (student.qr_code) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = student.qr_code;
        
        img.onload = function() {
          try {
            // Add QR code to the bottom left (different position compared to previous implementation)
            doc.addImage(img, 'PNG', 5, 35, 20, 20);
            // Save the document
            doc.save(`بطاقة_${student.name}.pdf`);
          } catch (error) {
            console.error("Error adding QR image:", error);
            // Still save the PDF even if QR code fails
            doc.save(`بطاقة_${student.name}.pdf`);
            toast({
              variant: "destructive",
              title: "تحذير",
              description: "تم إنشاء البطاقة بدون رمز QR",
            });
          }
        };
        
        // Handle errors in loading the QR code
        img.onerror = function() {
          console.error("Failed to load QR image");
          doc.save(`بطاقة_${student.name}.pdf`);
          toast({
            variant: "destructive",
            title: "تحذير",
            description: "تم إنشاء البطاقة بدون رمز QR",
          });
        };
      } else {
        // No QR code, just save the PDF
        doc.save(`بطاقة_${student.name}.pdf`);
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

  if (!student) {
    return <div>لا توجد بيانات للطالب</div>;
  }

  // تحديد الشعبة بأمان للعرض
  const displaySection = student.class ? (student.class.includes('-') ? student.class.split('-')[1] : student.class) : '';

  return (
    <Card className="overflow-hidden">
      {/* Header with school name */}
      <div className="bg-red-500 text-white py-2 text-center">
        <h3 className="text-lg font-medium">بطاقة طالب</h3>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {/* Circle photo placeholder */}
          <div className="h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          
          {/* Student name */}
          <h3 className="text-lg font-semibold mb-4">{student.name}</h3>
          
          <div className="w-full grid gap-2 text-sm mt-2">
            {/* Student details - right aligned */}
            <div className="flex justify-between">
              <span className="font-medium">الرقم المدني:</span>
              <span dir="ltr">{student.civil_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الصف:</span>
              <span>{student.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الشعبة:</span>
              <span>{displaySection}</span>
            </div>
            {student.specialization && (
              <div className="flex justify-between">
                <span className="font-medium">التخصص:</span>
                <span>{student.specialization}</span>
              </div>
            )}
          </div>

          {/* QR code at bottom */}
          <div className="mt-6 flex justify-between w-full">
            {/* QR code on the left */}
            <div className="flex-shrink-0">
              {student.qr_code && (
                <img 
                  src={student.qr_code} 
                  alt="QR Code" 
                  className="w-24 h-24"
                />
              )}
            </div>
            
            <div className="flex items-end">
              <Button 
                className="ml-auto"
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" />
                طباعة البطاقة
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
