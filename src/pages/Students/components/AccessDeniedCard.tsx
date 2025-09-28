
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const AccessDeniedCard: React.FC = () => {
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
              هذه الصفحة مخصصة للمدير فقط.
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
};

export default AccessDeniedCard;
