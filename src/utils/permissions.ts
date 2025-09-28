import { User, UserRole, Permission } from "@/types";

// تعريف الصلاحيات حسب الدور
const rolePermissions: Record<UserRole, Array<{ action: string; subject: string }>> = {
  principal: [
    // صلاحيات لوحة التحكم
    { action: "view", subject: "dashboard" },
    
    // صلاحيات الحضور
    { action: "view", subject: "attendance" },
    { action: "create", subject: "attendance" },
    { action: "update", subject: "attendance" },
    { action: "delete", subject: "attendance" },
    
    // صلاحيات الطلاب
    { action: "view", subject: "students" },
    { action: "create", subject: "students" },
    { action: "update", subject: "students" },
    { action: "delete", subject: "students" },
    
    // صلاحيات المعلمين
    { action: "view", subject: "teachers" },
    { action: "create", subject: "teachers" },
    { action: "update", subject: "teachers" },
    { action: "delete", subject: "teachers" },
    
    // صلاحيات التقارير
    { action: "view", subject: "reports" },
    { action: "create", subject: "reports" },
    { action: "export", subject: "reports" },
    
    // صلاحيات الإعدادات
    { action: "view", subject: "settings" },
    { action: "update", subject: "settings" },
  ],
  
  teacher: [
    // صلاحيات لوحة التحكم
    { action: "view", subject: "dashboard" },
    
    // صلاحيات الحضور
    { action: "view", subject: "attendance" },
    { action: "create", subject: "attendance" },
    { action: "update", subject: "attendance" },
    
    // صلاحيات الطلاب محدودة
    { action: "view", subject: "students" },
    
    // صلاحيات التقارير محدودة
    { action: "view", subject: "reports" },
    { action: "export", subject: "reports" },
    
    // صلاحيات الإعدادات المحدودة
    { action: "view", subject: "settings" },
  ],
  
  assistant: [
    // صلاحيات لوحة التحكم
    { action: "view", subject: "dashboard" },
    
    // صلاحيات الحضور
    { action: "view", subject: "attendance" },
    { action: "create", subject: "attendance" },
    
    // لا يوجد صلاحيات للطلاب أو المعلمين أو التقارير أو الإعدادات
  ],
};

// وظيفة للتحقق مما إذا كان المستخدم لديه صلاحية معينة
export const checkPermission = (user: User | null, action: string, subject: string): boolean => {
  // إذا كان المستخدم غير موجود، لا يوجد صلاحيات
  if (!user) return false;

  // الحصول على صلاحيات المستخدم بناءً على دوره
  const permissions = user.permissions || rolePermissions[user.role] || [];
  
  // التحقق من وجود الصلاحية المطلوبة
  return permissions.some(
    (permission) => permission.action === action && permission.subject === subject
  );
};

export const getUserPermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};
