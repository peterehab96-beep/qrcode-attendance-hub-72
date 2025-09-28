
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  FileText,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

const roleNameArabic = {
  principal: "المدير",
  teacher: "معلم",
  assistant: "مساعد"
};

const Navbar: React.FC = () => {
  const { user, signOut, can } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // تحديد عناصر التنقل بناءً على صلاحيات المستخدم
  const getNavItems = () => {
    if (!user) return [];
    
    const items = [
      {
        name: "لوحة التحكم",
        href: "/dashboard",
        icon: <Calendar className="h-5 w-5" />,
        visible: can("view", "dashboard"),
      },
      {
        name: "الحضور",
        href: "/attendance",
        icon: <QrCode className="h-5 w-5" />,
        visible: can("view", "attendance"),
      },
      {
        name: "الطلاب",
        href: "/students",
        icon: <Users className="h-5 w-5" />,
        visible: can("view", "students"),
      },
      {
        name: "المعلمين",
        href: "/teachers",
        icon: <User className="h-5 w-5" />,
        visible: can("view", "teachers"),
      },
      {
        name: "التقارير",
        href: "/reports",
        icon: <FileText className="h-5 w-5" />,
        visible: can("view", "reports"),
      },
      {
        name: "الإعدادات",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
        visible: can("view", "settings"),
      },
    ];

    // إرجاع فقط العناصر المرئية للمستخدم الحالي
    return items.filter(item => item.visible);
  };

  const navItems = getNavItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center">
            <QrCode className="h-6 w-6 text-primary ml-2" />
            <span className="font-bold text-xl text-primary">قُر حاضر</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex mr-6 items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon}
                <span className="mr-2">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User section and mobile menu button */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium ml-2">
                {user.name} ({roleNameArabic[user.role as UserRole]})
              </span>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">تسجيل الخروج</span>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">القائمة</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="mr-2">{item.name}</span>
              </Link>
            ))}
            {user && (
              <div className="pt-4 mt-4 border-t">
                <div className="mb-2 text-sm text-muted-foreground">
                  {user.name} ({roleNameArabic[user.role as UserRole]})
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                  <LogOut className="h-5 w-5 ml-2" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
