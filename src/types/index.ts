
export type UserRole = "principal" | "teacher" | "assistant";

export interface Permission {
  action: string;
  subject: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  civil_id?: string;
  permissions?: Permission[];
}

export interface Student {
  id: string;
  civil_id: string;
  name: string;
  code: string;
  class: string;
  grade: string;
  qr_code: string;
}

export interface Teacher {
  id: string;
  civil_id: string;
  name: string;
  classes: string[];
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  time: string;
  class: string;
  status: "present" | "late" | "absent";
  reason?: string;
  notes?: string;
}

export interface AttendanceStats {
  present: number;
  late: number;
  absent: number;
  total: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  can: (action: string, subject: string) => boolean;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
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

export interface AttendanceFilter {
  date?: string;
  class?: string;
  status?: "present" | "late" | "absent" | "all";
}
