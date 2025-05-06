
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { useQuery } from '@tanstack/react-query';
import { getHobbies } from '@/services/api/hobbies';
import { Palette, Book, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EducateurDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Fetch hobbies data
  const { data: hobbies = [], isLoading, error } = useQuery({
    queryKey: ['hobbies'],
    queryFn: getHobbies,
  });

  // Extract unique hobbies and interests for statistics
  const uniqueHobbies = [...new Set(hobbies.flatMap(h => h.hobbies || []))];
  const uniqueInterests = [...new Set(hobbies.flatMap(h => h.interests || []))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-bold">
              {t('dashboard.welcomeEducator') || 'Welcome to Educator Dashboard'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('dashboard.educatorWelcomeText') || 'Welcome to your dashboard. Use the navigation menu to access different sections.'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-bold">
              {t('dashboard.quickLinks') || 'Quick Links'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/hobbies')}
            >
              <Book className="mr-2 h-4 w-4" />
              {t('navigation.hobbies') || 'Manage Hobbies & Interests'}
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/enfants')}
            >
              <Palette className="mr-2 h-4 w-4" />
              {t('navigation.children') || 'Manage Children'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EnhancedCard hoverEffect gradient>
          <EnhancedCardHeader title={t('hobbies.recentlyAdded') || 'Recently Added'} />
          <EnhancedCardContent>
            <ul className="space-y-2">
              {hobbies.slice(0, 3).map((hobby) => (
                <li key={hobby.id} className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">{hobby.enfant_name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {hobby.hobbies?.[0] || 'N/A'}
                  </span>
                </li>
              ))}
              {hobbies.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  {t('hobbies.noRecentHobbies') || 'No hobbies data available'}
                </li>
              )}
            </ul>
          </EnhancedCardContent>
        </EnhancedCard>

        <EnhancedCard hoverEffect>
          <EnhancedCardHeader title={t('hobbies.popularHobbies') || 'Popular Hobbies'} />
          <EnhancedCardContent>
            <ul className="space-y-2">
              {uniqueHobbies.slice(0, 5).map((hobby, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" />
                  <span>{hobby}</span>
                </li>
              ))}
              {uniqueHobbies.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  {t('hobbies.noHobbiesFound') || 'No hobbies found'}
                </li>
              )}
            </ul>
          </EnhancedCardContent>
        </EnhancedCard>

        <EnhancedCard hoverEffect>
          <EnhancedCardHeader title={t('hobbies.popularInterests') || 'Popular Interests'} />
          <EnhancedCardContent>
            <ul className="space-y-2">
              {uniqueInterests.slice(0, 5).map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <span>{interest}</span>
                </li>
              ))}
              {uniqueInterests.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  {t('hobbies.noInterestsFound') || 'No interests found'}
                </li>
              )}
            </ul>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    </div>
  );
};

export default EducateurDashboard;
