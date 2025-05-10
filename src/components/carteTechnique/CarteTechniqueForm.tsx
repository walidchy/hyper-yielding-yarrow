
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CarteTechnique } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Calendar, FileText, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CarteTechniqueFormProps {
  initialData?: CarteTechnique | null;
  onSubmit: (data: Partial<CarteTechnique>) => void;
  onCancel: () => void;
}

const CarteTechniqueForm: React.FC<CarteTechniqueFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, setValue } = useForm<Partial<CarteTechnique>>({
    defaultValues: initialData || {
      name_nachat: '',
      type_nachat: '',
      sujet_nachat: '',
      goals_nachat: '',
      fi2a_mostahdafa: '',
      gender: '',
      '3adad_monkharitin': 0,
      lieu: '',
      time: new Date().toISOString().split('T')[0],
      hajyat: '',
      tari9a: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name_nachat">{t('carteTechnique.activityName')}</Label>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <Input {...register('name_nachat')} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type_nachat">{t('carteTechnique.activityType')}</Label>
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Input {...register('type_nachat')} required />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sujet_nachat">{t('carteTechnique.activitySubject')}</Label>
        <Textarea {...register('sujet_nachat')} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals_nachat">{t('carteTechnique.goals')}</Label>
        <Textarea {...register('goals_nachat')} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fi2a_mostahdafa">{t('carteTechnique.targetGroup')}</Label>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Input {...register('fi2a_mostahdafa')} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">{t('carteTechnique.gender')}</Label>
          <Select 
            onValueChange={(value) => setValue('gender', value)} 
            defaultValue={initialData?.gender || ''}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder={t('carteTechnique.selectGender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">{t('carteTechnique.male')}</SelectItem>
              <SelectItem value="F">{t('carteTechnique.female')}</SelectItem>
              <SelectItem value="mixed">{t('carteTechnique.mixed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="3adad_monkharitin">{t('carteTechnique.participants')}</Label>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Input 
              type="number" 
              {...register('3adad_monkharitin', { valueAsNumber: true })} 
              required 
              min={0} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lieu">{t('carteTechnique.location')}</Label>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Input {...register('lieu')} required />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">{t('carteTechnique.time')}</Label>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Input type="datetime-local" {...register('time')} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hajyat">{t('carteTechnique.requirements')}</Label>
        <Textarea {...register('hajyat')} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tari9a">{t('carteTechnique.method')}</Label>
        <Textarea {...register('tari9a')} required />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('carteTechnique.cancel')}
        </Button>
        <Button type="submit">
          {initialData ? t('carteTechnique.update') : t('carteTechnique.create')} {t('navigation.cartesTechniques')}
        </Button>
      </div>
    </form>
  );
};

export default CarteTechniqueForm;
