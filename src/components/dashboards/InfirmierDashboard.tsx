
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMaladies } from '@/services/api/maladies';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const InfirmierDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Fetch maladies count only for summary
  const { data: maladies, isLoading } = useQuery({
    queryKey: ['maladies'],
    queryFn: getMaladies,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">{t('dashboard.medicalDashboard')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('maladies.totalRecords')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? '...' : (maladies?.length || 0)}
            </p>
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={() => navigate('/maladies')}
            >
              {t('maladies.manage')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/maladies')}
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              {t('maladies.addNew')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfirmierDashboard;
