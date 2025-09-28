
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  permissions?: Permission[];
}

export type UserRole = "principal" | "teacher" | "assistant";

export interface Permission {
  action: string;
  subject: string;
}

export interface Student {
  id: string;
  civil_id: string;
  name: string;
  code: string;
  class: string;
  grade: string;
  specialization?: "علمي" | "أدبي";
  qr_code?: string;
}

export interface Teacher {
  id: string;
  civil_id: string;
  name: string;
  email?: string;
  classes: string[];
  subjects?: string[];
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  time: string;
  class: string;
  status: "present" | "late" | "absent";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  can: (action: string, subject: string) => boolean;
}

export interface AttendanceStats {
  present: number;
  late: number;
  absent: number;
  total: number;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  grades: string[]; // الصفوف (العاشر، الحادي عشر، الثاني عشر)
  sections: string[]; // الشعب (1، 2، 3)
  specializations: string[]; // التخصصات (علمي، أدبي)
}

export interface NotificationSettings {
  emailNotifications: boolean;
  dailyReports: boolean;
  absenceAlerts: boolean;
}

export interface ThemeSettings {
  darkMode: boolean;
  highContrast: boolean;
}

export interface ExcelStudent {
  name: string;
  civil_id: string;
  grade: string;
  section: string;
  specialization: string;
}
