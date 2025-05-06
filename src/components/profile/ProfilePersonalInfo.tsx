import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfilePersonalInfoProps {
  profile: any;
  onUpdate: (data: any) => void;
}

const ProfilePersonalInfo = ({ profile, onUpdate }: ProfilePersonalInfoProps) => {
  const { t, direction } = useLanguage();
  
  const form = useForm({
    defaultValues: {
      name: profile.name || '',
      phone: profile.phone || '',
      birthdate: profile.birthdate ? profile.birthdate.substring(0, 10) : '',
      cin: profile.cin || '',
      certification: profile.certification || '',
      address: profile.address || '',
    },
  });

  const onSubmit = (data: any) => {
    onUpdate(data);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t('profile.personalInformation')}</CardTitle>
        <CardDescription>{t('profile.yourPersonalDetails')}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir={direction} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.phone')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.dateOfBirth')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.cin')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.certification')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir={direction} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.address')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir={direction} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">{t('profile.saveChanges')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfilePersonalInfo;
