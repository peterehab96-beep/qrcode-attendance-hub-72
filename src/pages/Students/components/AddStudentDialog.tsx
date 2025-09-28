
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Student } from "@/types";

interface AddStudentDialogProps {
  onAddStudent: (student: Partial<Student>) => boolean;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ onAddStudent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    civil_id: "",
    name: "",
    code: "",
    class: "",
    grade: "",
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle add student submission
  const handleAddStudent = () => {
    const success = onAddStudent(newStudent);
    if (success) {
      setNewStudent({
        civil_id: "",
        name: "",
        code: "",
        class: "",
        grade: "",
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة طالب
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            إضافة طالب جديد
          </DialogTitle>
          <DialogDescription>
            أدخل معلومات الطالب لإضافته إلى النظام
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="civil_id">
              الرقم المدني
            </Label>
            <Input
              id="civil_id"
              name="civil_id"
              className="col-span-3"
              placeholder="الرقم المدني للطالب"
              value={newStudent.civil_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              الاسم الكامل
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              placeholder="الاسم الكامل للطالب"
              value={newStudent.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="code">
              رمز الطالب
            </Label>
            <Input
              id="code"
              name="code"
              className="col-span-3"
              placeholder="رمز الهوية المدرسية (ST####)"
              value={newStudent.code}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="class">
              الفصل
            </Label>
            <Input
              id="class"
              name="class"
              className="col-span-3"
              placeholder="مثال: 10-A"
              value={newStudent.class}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="grade">
              الصف
            </Label>
            <Input
              id="grade"
              name="grade"
              className="col-span-3"
              placeholder="مثال: 10"
              value={newStudent.grade}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleAddStudent}>
            إضافة طالب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
