
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings as SettingsIcon, 
  School, 
  Bell, 
  Languages, 
  Trash, 
  Plus,
  GraduationCap,
  BookOpen
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { SchoolSettings, NotificationSettings, ThemeSettings } from "@/types";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { user, can } = useAuth();
  const { toast } = useToast();
  
  // إعدادات الإشعارات
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    dailyReports: true,
    absenceAlerts: true,
  });

  // إعدادات المدرسة
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
    schoolName: "مدرسة النهضة الثانوية",
    schoolAddress: "شارع الملك فهد، الرياض",
    schoolPhone: "0112345678",
    schoolEmail: "info@school.edu.sa",
    grades: ["العاشر", "الحادي عشر", "الثاني عشر"],
    sections: ["أ", "ب", "ج"],
    specializations: ["علمي", "أدبي"],
  });

  // إعدادات المظهر
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    darkMode: false,
    highContrast: false,
  });

  // حقول جديدة
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");

  // تغيير حالة مفاتيح التبديل
  const handleToggleChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // تغيير إعدادات المظهر
  const handleThemeToggle = (setting: keyof ThemeSettings) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // تغيير قيم الحقول النصية
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolSettings(prev => ({
      ...prev,
      [name as keyof SchoolSettings]: value
    }));
  };

  // إضافة صف جديد
  const handleAddGrade = () => {
    if (!newGrade || schoolSettings.grades.includes(newGrade)) return;
    setSchoolSettings(prev => ({
      ...prev,
      grades: [...prev.grades, newGrade]
    }));
    setNewGrade("");
  };
  
  // حذف صف
  const handleRemoveGrade = (grade: string) => {
    setSchoolSettings(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g !== grade)
    }));
  };
  
  // إضافة شعبة جديدة
  const handleAddSection = () => {
    if (!newSection || schoolSettings.sections.includes(newSection)) return;
    setSchoolSettings(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setNewSection("");
  };
  
  // حذف شعبة
  const handleRemoveSection = (section: string) => {
    setSchoolSettings(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s !== section)
    }));
  };
  
  // إضافة تخصص جديد
  const handleAddSpecialization = () => {
    if (!newSpecialization || schoolSettings.specializations.includes(newSpecialization)) return;
    setSchoolSettings(prev => ({
      ...prev,
      specializations: [...prev.specializations, newSpecialization]
    }));
    setNewSpecialization("");
  };
  
  // حذف تخصص
  const handleRemoveSpecialization = (specialization: string) => {
    setSchoolSettings(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  // حفظ الإعدادات
  const handleSaveSettings = () => {
    localStorage.setItem("school_settings", JSON.stringify(schoolSettings));
    localStorage.setItem("notification_settings", JSON.stringify(notificationSettings));
    localStorage.setItem("theme_settings", JSON.stringify(themeSettings));
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات النظام بنجاح.",
    });
  };

  // إعادة تعيين الإعدادات
  const handleResetSettings = () => {
    setNotificationSettings({
      emailNotifications: true,
      dailyReports: true,
      absenceAlerts: true,
    });
    
    setThemeSettings({
      darkMode: false,
      highContrast: false,
    });
    
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم إعادة تعيين الإعدادات إلى القيم الافتراضية.",
    });
  };

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedSchoolSettings = localStorage.getItem("school_settings");
    const savedNotificationSettings = localStorage.getItem("notification_settings");
    const savedThemeSettings = localStorage.getItem("theme_settings");
    
    if (savedSchoolSettings) {
      const parsed = JSON.parse(savedSchoolSettings);
      // التأكد من وجود الحقول الجديدة
      setSchoolSettings({
        ...parsed,
        grades: parsed.grades || ["العاشر", "الحادي عشر", "الثاني عشر"],
        sections: parsed.sections || ["أ", "ب", "ج"],
        specializations: parsed.specializations || ["علمي", "أدبي"],
      });
    }
    
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings));
    }
    
    if (savedThemeSettings) {
      setThemeSettings(JSON.parse(savedThemeSettings));
    }
  }, []);

  // التحقق من صلاحيات الوصول
  if (!user || !can("view", "settings")) {
    return (
      <div className="min-h-screen flex flex-col rtl arabic">
        <Navbar />
        <div className="flex-1 container py-6 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>تم رفض الوصول</CardTitle>
              <CardDescription>
                ليس لديك إذن للوصول إلى هذه الصفحة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                هذه الصفحة مخصصة للمستخدمين المصرح لهم فقط.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard">
                  العودة إلى لوحة التحكم
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col rtl arabic">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* العنوان */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <SettingsIcon className="ml-2 h-6 w-6" />
                الإعدادات
              </h1>
              <p className="text-muted-foreground">
                إدارة إعدادات النظام والتفضيلات
              </p>
            </div>
          </div>
          
          {/* علامات التبويب */}
          <Tabs defaultValue="school" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="school" className="flex items-center">
                <School className="ml-2 h-4 w-4" />
                المدرسة
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center">
                <GraduationCap className="ml-2 h-4 w-4" />
                الأكاديمية
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="ml-2 h-4 w-4" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Languages className="ml-2 h-4 w-4" />
                المظهر
              </TabsTrigger>
            </TabsList>
            
            {/* إعدادات المدرسة */}
            <TabsContent value="school">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المدرسة</CardTitle>
                  <CardDescription>
                    إدارة معلومات المدرسة الأساسية التي تظهر في النظام والتقارير.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">اسم المدرسة</Label>
                      <Input
                        id="schoolName"
                        name="schoolName"
                        value={schoolSettings.schoolName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolEmail">البريد الإلكتروني</Label>
                      <Input
                        id="schoolEmail"
                        name="schoolEmail"
                        type="email"
                        value={schoolSettings.schoolEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolPhone">رقم الهاتف</Label>
                      <Input
                        id="schoolPhone"
                        name="schoolPhone"
                        value={schoolSettings.schoolPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolAddress">العنوان</Label>
                      <Input
                        id="schoolAddress"
                        name="schoolAddress"
                        value={schoolSettings.schoolAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleResetSettings}>
                    إعادة تعيين
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    حفظ التغييرات
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* إعدادات الأكاديمية */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات الأكاديمية</CardTitle>
                  <CardDescription>
                    إدارة الصفوف والشعب والتخصصات في النظام.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* إدارة الصفوف */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="ml-2 h-5 w-5" />
                      إدارة الصفوف
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {schoolSettings.grades.map((grade) => (
                        <Badge key={grade} variant="secondary" className="px-3 py-1">
                          {grade}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 mr-2 hover:text-destructive"
                            onClick={() => handleRemoveGrade(grade)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف صفًا جديدًا"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                      />
                      <Button onClick={handleAddGrade}>
                        <Plus className="h-4 w-4 ml-1" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                  
                  {/* إدارة الشعب */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="ml-2 h-5 w-5" />
                      إدارة الشعب
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {schoolSettings.sections.map((section) => (
                        <Badge key={section} variant="secondary" className="px-3 py-1">
                          {section}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 mr-2 hover:text-destructive"
                            onClick={() => handleRemoveSection(section)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف شعبة جديدة"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                      />
                      <Button onClick={handleAddSection}>
                        <Plus className="h-4 w-4 ml-1" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                  
                  {/* إدارة التخصصات */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="ml-2 h-5 w-5" />
                      إدارة التخصصات
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {schoolSettings.specializations.map((specialization) => (
                        <Badge key={specialization} variant="secondary" className="px-3 py-1">
                          {specialization}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 mr-2 hover:text-destructive"
                            onClick={() => handleRemoveSpecialization(specialization)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف تخصصًا جديدًا"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                      />
                      <Button onClick={handleAddSpecialization}>
                        <Plus className="h-4 w-4 ml-1" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings}>حفظ التغييرات</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* إعدادات الإشعارات */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>
                    تخصيص كيفية استلام الإشعارات من النظام.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">الإشعارات عبر البريد الإلكتروني</div>
                      <div className="text-sm text-muted-foreground">
                        استلام تنبيهات وملخصات عبر البريد الإلكتروني
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleToggleChange("emailNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">تقارير الحضور اليومية</div>
                      <div className="text-sm text-muted-foreground">
                        استلام تقرير يومي للحضور في نهاية اليوم
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.dailyReports}
                      onCheckedChange={() => handleToggleChange("dailyReports")}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">تنبيهات الغياب</div>
                      <div className="text-sm text-muted-foreground">
                        استلام تنبيه فوري عندما يتم تسجيل طالب كغائب
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.absenceAlerts}
                      onCheckedChange={() => handleToggleChange("absenceAlerts")}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleResetSettings}>
                    إعادة تعيين
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    حفظ التغييرات
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* إعدادات المظهر */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المظهر</CardTitle>
                  <CardDescription>
                    تخصيص مظهر التطبيق واللغة.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">الوضع الليلي</div>
                      <div className="text-sm text-muted-foreground">
                        التبديل بين الوضع الفاتح والوضع الداكن
                      </div>
                    </div>
                    <Switch
                      checked={themeSettings.darkMode}
                      onCheckedChange={() => handleThemeToggle("darkMode")}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">تباين عالي</div>
                      <div className="text-sm text-muted-foreground">
                        زيادة تباين الألوان للقراءة الأسهل
                      </div>
                    </div>
                    <Switch
                      checked={themeSettings.highContrast}
                      onCheckedChange={() => handleThemeToggle("highContrast")}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleResetSettings}>
                    إعادة تعيين
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    حفظ التغييرات
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
