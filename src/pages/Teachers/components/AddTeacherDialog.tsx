
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Teacher } from "@/types";

interface AddTeacherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTeacher: (teacher: Partial<Teacher>) => void;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddTeacher,
}) => {
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    civil_id: "",
    name: "",
    classes: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "classes") {
      // تحويل النص المفصول بفواصل إلى مصفوفة
      setNewTeacher((prev) => ({ ...prev, [name]: value.split(",") }));
    } else {
      setNewTeacher((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onAddTeacher(newTeacher);
    // إعادة تعيين النموذج
    setNewTeacher({
      civil_id: "",
      name: "",
      classes: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة معلم
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            إضافة معلم جديد
          </DialogTitle>
          <DialogDescription>
            أدخل معلومات المعلم لإضافته إلى النظام
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
              placeholder="الرقم المدني للمعلم"
              value={newTeacher.civil_id}
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
              placeholder="الاسم الكامل للمعلم"
              value={newTeacher.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="classes">
              الفصول
            </Label>
            <Input
              id="classes"
              name="classes"
              className="col-span-3"
              placeholder="الفصول مفصولة بفواصل (مثال: 10-أ، 11-ب)"
              value={newTeacher.classes?.join(",")}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleSubmit}>
            إضافة معلم
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
