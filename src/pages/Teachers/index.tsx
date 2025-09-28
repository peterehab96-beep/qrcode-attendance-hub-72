
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileDown, Plus, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Teacher } from "@/types";
import Navbar from "@/components/Navbar";
import TeacherTable from "./components/TeacherTable";
import AddTeacherDialog from "./components/AddTeacherDialog";
import EditTeacherDialog from "./components/EditTeacherDialog";
import AccessDeniedCard from "./components/AccessDeniedCard";
import { useTeachers } from "./hooks/useTeachers";

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const { user, can } = useAuth();
  
  const {
    teachers,
    filteredTeachers,
    handleAddTeacher,
    handleEditTeacher,
    handleDeleteTeacher,
    handleExportTeachers
  } = useTeachers(searchQuery);

  // التحقق من صلاحيات المستخدم للوصول إلى هذه الصفحة
  if (!user || !can("view", "teachers")) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="min-h-screen flex flex-col rtl arabic">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* العنوان */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                إدارة المعلمين
              </h1>
              <p className="text-muted-foreground">
                إضافة وتعديل وإدارة سجلات المعلمين
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {can("export", "reports") && (
                <Button variant="outline" onClick={handleExportTeachers}>
                  <FileDown className="ml-2 h-4 w-4" />
                  تصدير المعلمين
                </Button>
              )}
              
              {can("create", "teachers") && (
                <AddTeacherDialog 
                  isOpen={isAddDialogOpen} 
                  onOpenChange={setIsAddDialogOpen}
                  onAddTeacher={handleAddTeacher}
                />
              )}
            </div>
          </div>
          
          {/* البحث والتصفية */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن معلمين بالاسم، الرقم المدني..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* جدول المعلمين */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="ml-2 h-5 w-5" />
                المعلمين
                <span className="mr-2 text-sm font-normal text-muted-foreground">
                  ({filteredTeachers.length})
                </span>
              </CardTitle>
              <CardDescription>
                عرض وإدارة جميع المعلمين في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherTable 
                teachers={filteredTeachers}
                onEdit={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsEditDialogOpen(true);
                }}
                onDelete={handleDeleteTeacher}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* حوار تعديل المعلم */}
      {selectedTeacher && (
        <EditTeacherDialog
          teacher={selectedTeacher}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onEditTeacher={handleEditTeacher}
        />
      )}
    </div>
  );
};

export default Teachers;
