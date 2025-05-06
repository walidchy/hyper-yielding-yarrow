
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phase } from '@/types';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhaseFormProps {
  phase?: Phase | null;
  onSubmit: (data: Partial<Phase>) => void;
  onCancel: () => void;
}

const PhaseForm = ({ phase, onSubmit, onCancel }: PhaseFormProps) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: phase ? {
      ...phase,
      // Format dates for the input fields
      start_date: phase.start_date ? format(new Date(phase.start_date), 'yyyy-MM-dd') : '',
      end_date: phase.end_date ? format(new Date(phase.end_date), 'yyyy-MM-dd') : ''
    } : {
      name: '',
      year: new Date().getFullYear(),
      start_date: '',
      end_date: ''
    }
  });

  const startDate = watch('start_date');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Input
            {...register('name', { 
              required: t('phases.form.nameRequired', ['Name is required']),
              maxLength: { 
                value: 255, 
                message: t('phases.form.nameLength', ['Name cannot exceed 255 characters']) 
              }
            })}
            placeholder={t('phases.form.namePlaceholder', ['Phase Name'])}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <Input
            type="number"
            {...register('year', { 
              required: t('phases.form.yearRequired', ['Year is required']),
              valueAsNumber: true,
              min: { 
                value: 2000, 
                message: t('phases.form.yearMin', ['Year must be 2000 or later']) 
              }
            })}
            placeholder={t('phases.form.yearPlaceholder', ['Year'])}
          />
          {errors.year && (
            <span className="text-sm text-red-500">{errors.year.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="date"
            {...register('start_date', { 
              required: t('phases.form.startDateRequired', ['Start date is required']) 
            })}
            placeholder={t('phases.form.startDatePlaceholder', ['Start Date'])}
          />
          {errors.start_date && (
            <span className="text-sm text-red-500">{errors.start_date.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="date"
            {...register('end_date', { 
              required: t('phases.form.endDateRequired', ['End date is required']),
              validate: value => 
                !startDate || !value || new Date(value) >= new Date(startDate) || 
                t('phases.form.endDateAfterStart', ['End date must be after or equal to start date'])
            })}
            placeholder={t('phases.form.endDatePlaceholder', ['End Date'])}
            min={startDate}
          />
          {errors.end_date && (
            <span className="text-sm text-red-500">{errors.end_date.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('general.cancel', ['Cancel'])}
        </Button>
        <Button type="submit">
          {phase ? t('general.update', ['Update']) : t('general.create', ['Create'])} {t('phases.title.singular', ['Phase'])}
        </Button>
      </div>
    </form>
  );
};

export default PhaseForm;
