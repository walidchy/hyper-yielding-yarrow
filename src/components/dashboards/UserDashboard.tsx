
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Music, Book } from 'lucide-react';

const UserDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-bold mb-2 text-foreground">
        {t('dashboard.welcome')}, {user?.name}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Music className="h-5 w-5" />
              {t('anachids.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              {t('dashboard.viewAnachids')}
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/anachids')}
              variant="outline"
            >
              {t('common.show')}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('posts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              {t('dashboard.viewPosts')}
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/posts')}
              variant="outline"
            >
              {t('common.show')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
