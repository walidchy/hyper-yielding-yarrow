import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { User, X, ChevronRight } from 'lucide-react';
import DirectorDashboard from '@/components/dashboards/DirectorDashboard';
import EducateurDashboard from '@/components/dashboards/EducateurDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InfirmierDashboard from '@/components/dashboards/InfirmierDashboard';
import PostmanDashboard from '@/components/dashboards/PostmanDashboard';
import UserDashboard from '@/components/dashboards/UserDashboard';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md shadow-card">
            <CardHeader>
              <CardTitle className="text-center">{t('dashboard.authRequired')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t('dashboard.pleaseLogin')}</p>
              <div className="mt-4 flex justify-center">
                <a href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  {t('dashboard.goToLogin')}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'director':
        return <DirectorDashboard />;
      case 'educateur':
        return <EducateurDashboard />;
      case 'infirmier':
        return <InfirmierDashboard />;
      case 'postman':
        return <PostmanDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {welcomeVisible && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 bg-card shadow-card rounded-lg border border-border p-4 animate-slide-in z-50">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-foreground">{t('dashboard.welcome')}, {user.name}!</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t(`roles.${user.role}`)}</p>
            </div>
            <button 
              onClick={() => setWelcomeVisible(false)}
              className="flex-shrink-0 ml-2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('dashboard.dashboard')}</h1>
            <p className="text-muted-foreground mt-1">{t('dashboard.welcome')}, {user.name}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <a href="/profile" className="flex items-center text-sm text-primary hover:underline">
              {t('dashboard.viewProfile')} <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
      {renderDashboardByRole()}
    </DashboardLayout>
  );
};

export default Dashboard;
