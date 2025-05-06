
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserRole, Member } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface MemberFormProps {
  member: Member | null;
  onSubmit: (data: Partial<Member> & { password?: string; password_confirmation?: string }) => void;
  onCancel: () => void;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const { t } = useLanguage();
  const form = useForm<Partial<Member> & { password?: string; password_confirmation?: string }>({
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      password: '',
      password_confirmation: '',
      role: member?.role || 'normal',
      phone: member?.phone || '',
      profile_picture: member?.profile_picture || '',
      status: member?.status || 'active',
      gender: member?.gender,
      cin: member?.cin || '',
      date_naissance: member?.date_naissance || '',
      certification: member?.certification || '',
      address: member?.address || '',
      join_year: member?.join_year || new Date().getFullYear()
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.fullName', ['Full Name'])}</FormLabel>
                <FormControl>
                  <Input placeholder={t('members.form.fullName', ['Full Name'])} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.emailAddress', ['Email Address'])}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.password', ['Password'])}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.confirmPassword', ['Confirm Password'])}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.role', ['Role'])}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    {...field}
                    value={field.value as string}
                    onChange={(e) => {
                      field.onChange(e.target.value as UserRole);
                    }}
                  >
                    <option value="">{t('members.form.selectRole', ['Select Role'])}</option>
                    <option value="director">{t('members.roles.director', ['Director'])}</option>
                    <option value="animateur_general">{t('members.roles.animateurGeneral', ['General Animator'])}</option>
                    <option value="chef_groupe">{t('members.roles.chefGroupe', ['Group Leader'])}</option>
                    <option value="educateur">{t('members.roles.educateur', ['Educator'])}</option>
                    <option value="infirmier">{t('members.roles.infirmier', ['Nurse'])}</option>
                    <option value="economat">{t('members.roles.economat', ['Supply Manager'])}</option>
                    <option value="postman">{t('members.roles.postman', ['Postman'])}</option>
                    <option value="normal">{t('members.roles.normal', ['Normal User'])}</option>
                  </select>
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
                <FormLabel>{t('members.form.phone', ['Phone Number'])}</FormLabel>
                <FormControl>
                  <Input placeholder="+212 600000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.status', ['Status'])}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                  >
                    <option value="active">{t('members.status.active', ['Active'])}</option>
                    <option value="inactive">{t('members.status.inactive', ['Inactive'])}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.profilePicture', ['Profile Picture URL'])}</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/profile.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.gender', ['Gender'])}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                    value={field.value || ""}
                  >
                    <option value="" disabled>{t('members.form.selectGender', ['Select Gender'])}</option>
                    <option value="M">{t('children.male', ['Male'])}</option>
                    <option value="F">{t('children.female', ['Female'])}</option>
                  </select>
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
                <FormLabel>{t('members.form.cin', ['CIN'])}</FormLabel>
                <FormControl>
                  <Input placeholder="AB123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_naissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.dateOfBirth', ['Date of Birth'])}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>{t('members.form.certification', ['Certification'])}</FormLabel>
                <FormControl>
                  <Input placeholder="First Aid, CPR, etc." {...field} />
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
                <FormLabel>{t('members.form.address', ['Address'])}</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="join_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('members.form.joinYear', ['Join Year'])}</FormLabel>
                <FormControl>
                  <Input type="number" min="1900" max={new Date().getFullYear() + 1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('general.cancel', ['Cancel'])}
          </Button>
          <Button type="submit">
            {member ? t('members.edit', ['Update']) : t('members.add', ['Create'])} {t('members.title', ['Member'])}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
