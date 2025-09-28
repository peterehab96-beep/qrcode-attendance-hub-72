
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Student } from "@/types";

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (student: Student) => boolean;
}

const EditStudentDialog: React.FC<EditStudentDialogProps> = ({ 
  student, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [editedStudent, setEditedStudent] = React.useState<Student | null>(student);

  React.useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  if (!editedStudent) {
    return null;
  }
  
  // Handle edit form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => prev ? { ...prev, [name]: value } : null);
  };
  
  // Handle update student
  const handleUpdateStudent = () => {
    if (!editedStudent) return;

    // Make sure specialization is a valid value
    let studentToUpdate = { ...editedStudent };
    
    // Ensure specialization is properly typed
    if (studentToUpdate.specialization !== "علمي" && studentToUpdate.specialization !== "أدبي") {
      studentToUpdate.specialization = "علمي";
    }
    
    const success = onUpdate(studentToUpdate);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            تعديل بيانات الطالب
          </DialogTitle>
          <DialogDescription>
            قم بتعديل معلومات الطالب
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_civil_id">
              الرقم المدني
            </Label>
            <Input
              id="edit_civil_id"
              name="civil_id"
              className="col-span-3"
              value={editedStudent.civil_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_name">
              الاسم الكامل
            </Label>
            <Input
              id="edit_name"
              name="name"
              className="col-span-3"
              value={editedStudent.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_code">
              رمز الطالب
            </Label>
            <Input
              id="edit_code"
              name="code"
              className="col-span-3"
              value={editedStudent.code}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_class">
              الفصل
            </Label>
            <Input
              id="edit_class"
              name="class"
              className="col-span-3"
              value={editedStudent.class}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_grade">
              الصف
            </Label>
            <Input
              id="edit_grade"
              name="grade"
              className="col-span-3"
              value={editedStudent.grade}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleUpdateStudent}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
