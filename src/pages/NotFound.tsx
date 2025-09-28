
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${isArabic ? "rtl arabic" : ""}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          {isArabic ? "عفواً! الصفحة غير موجودة" : "Oops! Page not found"}
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {isArabic ? "العودة إلى الصفحة الرئيسية" : "Return to Home"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
