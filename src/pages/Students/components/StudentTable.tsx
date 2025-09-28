
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Printer, QrCode, Search, Trash, Users } from "lucide-react";
import { Student } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onPrint: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  onEdit, 
  onDelete,
  onPrint
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { can } = useAuth();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.civil_id.includes(query) ||
      student.code.toLowerCase().includes(query) ||
      student.class.toLowerCase().includes(query) ||
      student.grade.toLowerCase().includes(query)
    );
  });

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 px-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن طلاب بالاسم، الرمز، الرقم المدني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Students Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="ml-2 h-5 w-5" />
            قائمة الطلاب
            <span className="mr-2 text-sm font-normal text-muted-foreground">
              ({filteredStudents.length})
            </span>
          </CardTitle>
          <CardDescription>
            عرض وإدارة جميع الطلاب في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
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
                          <div className="flex justify-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => onPrint(student)} title="طباعة البطاقة">
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">طباعة</span>
                            </Button>
                            
                            {can("update", "students") && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onEdit(student)}
                                title="تعديل بيانات الطالب"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">تعديل</span>
                              </Button>
                            )}
                            
                            {can("delete", "students") && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setStudentToDelete(student)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                                title="حذف الطالب"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        لم يتم العثور على طلاب
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف بيانات الطالب "{studentToDelete?.name}"؟
              <br />
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-between">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StudentTable;
