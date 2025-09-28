
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Student } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useStudents } from "./hooks/useStudents";
import StudentTable from "./components/StudentTable";
import AddStudentDialog from "./components/AddStudentDialog";
import EditStudentDialog from "./components/EditStudentDialog";
import AccessDeniedCard from "./components/AccessDeniedCard";

// Update the createStudent function to return a boolean instead of a Student
const createStudent = (newStudentData: Partial<Student>): boolean => {
  // Implementation would go here
  // Return true on success
  return true;
};

// Update the updateStudent function to return a boolean instead of a Student
const updateStudent = (updatedStudent: Student): boolean => {
  // Implementation would go here
  // Return true on success
  return true;
};

const Students: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { user, can } = useAuth();
  const { 
    students, 
    addStudent, 
    updateStudent: updateStudentHook, 
    deleteStudent, 
    printStudentCard,
    bulkUpload,
    exportStudents 
  } = useStudents();

  // Handle editing a student
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  // Handle printing a student card
  const handlePrintStudentCard = (student: Student) => {
    if (student) {
      printStudentCard(student);
    }
  };

  // Check if user has permission to access this page
  if (!user || !can("view", "students")) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="min-h-screen flex flex-col rtl arabic">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                إدارة الطلاب
              </h1>
              <p className="text-muted-foreground">
                إضافة وتعديل وإدارة سجلات الطلاب
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {can("export", "reports") && (
                <Button variant="outline" onClick={exportStudents}>
                  <FileDown className="ml-2 h-4 w-4" />
                  تصدير الطلاب
                </Button>
              )}
              <Button onClick={bulkUpload} variant="outline">
                <Upload className="ml-2 h-4 w-4" />
                تحميل جماعي
              </Button>
              
              {can("create", "students") && (
                <AddStudentDialog onAddStudent={addStudent} />
              )}
            </div>
          </div>
          
          {/* Student Table */}
          <StudentTable 
            students={students}
            onEdit={handleEditStudent}
            onDelete={deleteStudent}
            onPrint={handlePrintStudentCard}
          />
        </div>
      </main>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onUpdate={updateStudentHook}
      />
    </div>
  );
};

export default Students;
