
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile, updateProfilePicture } from '@/services/api/users';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import ProfilePersonalInfo from '@/components/profile/ProfilePersonalInfo';
import ProfileAccountSettings from '@/components/profile/ProfileAccountSettings';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(t('profile.updateSuccess'));
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error(t('profile.updateError'));
    },
  });

  // Update the picture mutation to include better error logging
  const updatePictureMutation = useMutation({
    mutationFn: (file: File) => {
      if (!profile?.id) {
        throw new Error('Profile ID is missing');
      }
      return updateProfilePicture(file, profile.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(t('profile.pictureUpdateSuccess'));
    },
    onError: (error) => {
      console.error('Picture update error:', error);
      toast.error(t('profile.pictureUpdateError'));
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.pleaseLogin')}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/login')}>{t('dashboard.goToLogin')}</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.notFound')}</CardTitle>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">{t('profile.profile')}</h1>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            {t('dashboard.dashboard')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_3fr]">
          <ProfilePictureUpload 
            profile={profile} 
            onUpload={(file) => updatePictureMutation.mutate(file)}
          />
          
          <div className="space-y-8">
            <ProfilePersonalInfo 
              profile={profile} 
              onUpdate={(data) => updateProfileMutation.mutate({ ...data, id: profile.id })}
            />
            
            <ProfileAccountSettings profile={profile} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
