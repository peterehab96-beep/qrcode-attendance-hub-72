
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Teacher } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
}

const TeacherTable: React.FC<TeacherTableProps> = ({ 
  teachers, 
  onEdit, 
  onDelete 
}) => {
  const { can } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // استخراج الفصول الفريدة من بيانات المعلمين لاستخدامها في التصفية
  const uniqueClasses = Array.from(
    new Set(
      teachers.flatMap(teacher => teacher.classes || [])
    )
  ).sort();

  // تصفية المعلمين بناءً على استعلام البحث والفصل المحدد
  const filteredTeachers = teachers.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      teacher.name.toLowerCase().includes(query) ||
      teacher.civil_id.includes(query) ||
      (teacher.classes?.join(" ").toLowerCase() || "").includes(query);

    const matchesClass = selectedClass === "" || 
      teacher.classes?.includes(selectedClass);

    return matchesSearch && matchesClass;
  });

  return (
    <>
      {/* بحث وتصفية */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن معلمين بالاسم، الرقم المدني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedClass === "" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedClass("")}
              >
                الكل
              </Button>
              {uniqueClasses.map((className) => (
                <Button 
                  key={className}
                  variant={selectedClass === className ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedClass(className)}
                >
                  {className}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول المعلمين */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الرقم المدني</TableHead>
              <TableHead>الفصول</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.civil_id}</TableCell>
                  <TableCell>{teacher.classes?.join(", ") || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {can("update", "teachers") && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">تعديل</span>
                        </Button>
                      )}
                      {can("delete", "teachers") && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(teacher.id)}
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
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  لم يتم العثور على معلمين
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TeacherTable;
