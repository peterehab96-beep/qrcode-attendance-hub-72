
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types";

interface EditTeacherDialogProps {
  teacher: Teacher;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTeacher: (teacher: Teacher) => void;
}

const EditTeacherDialog: React.FC<EditTeacherDialogProps> = ({
  teacher,
  isOpen,
  onOpenChange,
  onEditTeacher,
}) => {
  const [editedTeacher, setEditedTeacher] = useState<Teacher>(teacher);

  // تحديث النموذج عند تغيير المعلم المحدد
  useEffect(() => {
    setEditedTeacher(teacher);
  }, [teacher]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "classes") {
      // تحويل النص المفصول بفواصل إلى مصفوفة
      setEditedTeacher((prev) => ({ ...prev, [name]: value.split(",") }));
    } else {
      setEditedTeacher((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onEditTeacher(editedTeacher);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            تعديل بيانات المعلم
          </DialogTitle>
          <DialogDescription>
            قم بتعديل معلومات المعلم
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
              value={editedTeacher.civil_id}
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
              value={editedTeacher.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="edit_classes">
              الفصول
            </Label>
            <Input
              id="edit_classes"
              name="classes"
              className="col-span-3"
              placeholder="الفصول مفصولة بفواصل (مثال: 10-أ، 11-ب)"
              value={editedTeacher.classes?.join(",")}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleSubmit}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherDialog;
