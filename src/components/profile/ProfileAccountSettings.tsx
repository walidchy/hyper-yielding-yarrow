import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock } from 'lucide-react';
import ChangePasswordDialog from './ChangePasswordDialog';

interface ProfileAccountSettingsProps {
  profile: any;
}

const ProfileAccountSettings = ({ profile }: ProfileAccountSettingsProps) => {
  const { t } = useLanguage();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t('profile.accountSettings')}</CardTitle>
        <CardDescription>{t('profile.manageAccountPrefs')}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-1">{t('profile.role')}</p>
            <p className="text-muted-foreground">
              {t(`roles.${profile.role?.toLowerCase()}`) || t('profile.notSpecified')}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">{t('profile.status')}</p>
            <div className="flex items-center">
              <div 
                className="w-2.5 h-2.5 rounded-full me-2 bg-green-500"
              />
              <p className="text-muted-foreground">
                Active
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">{t('profile.joinYear')}</p>
            <p className="text-muted-foreground">
              {profile.created_at 
                ? format(new Date(profile.created_at), 'yyyy')
                : t('profile.unknown')}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Email</p>
            <p className="text-muted-foreground break-all">
              {profile.email || t('profile.notSpecified')}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="font-medium mb-4">{t('profile.security')}</h4>
          <Button variant="outline" onClick={() => setChangePasswordOpen(true)}>
            <Lock className="w-4 h-4 mr-2" />
            {t('profile.changePassword')}
          </Button>
        </div>

        <ChangePasswordDialog 
          open={changePasswordOpen} 
          onOpenChange={setChangePasswordOpen}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileAccountSettings;
