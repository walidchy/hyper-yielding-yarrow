
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ogec-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-ogec-primary mb-4">{t('notFound.title')}</h1>
        <p className="text-xl text-gray-600 mb-6">{t('notFound.message')}</p>
        <p className="max-w-md mx-auto text-gray-500 mb-8">
          {t('notFound.description')}
        </p>
        <Button asChild>
          <Link to="/">{t('notFound.returnHome')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
