
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Program } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgramFormProps {
  program: Program | null;
  phases: any[];
  onSubmit: (data: Partial<Program>) => void;
  onCancel: () => void;
}

const ProgramForm = ({ program, phases, onSubmit, onCancel }: ProgramFormProps) => {
  const { t, direction } = useLanguage();
  
  const form = useForm({
    defaultValues: {
      phase_id: program?.phase_id || '',
      jour: program?.jour ? program.jour.substring(0, 10) : '',
      horaire: program?.horaire || '',
      type_activite: program?.type_activite || '',
      activite: program?.activite || '',
      jour_semaine: program?.jour_semaine || ''
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      phase_id: Number(data.phase_id)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phase_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.phaseLabel')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(value)}
                    dir={direction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('programs.form.selectPhase')} />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map(phase => (
                        <SelectItem key={phase.id} value={phase.id.toString()}>
                          {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.dateLabel')}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.timeLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('programs.form.timePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_activite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.activityTypeLabel')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    dir={direction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('programs.form.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matin">{t('programs.form.morning')}</SelectItem>
                      <SelectItem value="apres_midi">{t('programs.form.afternoon')}</SelectItem>
                      <SelectItem value="soiree">{t('programs.form.evening')}</SelectItem>
                      <SelectItem value="journee_complete">{t('programs.form.fullDay')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.activityLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('programs.form.activityPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jour_semaine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('programs.form.dayOfWeekLabel')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    dir={direction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('programs.form.selectDay')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">{t('programs.form.monday')}</SelectItem>
                      <SelectItem value="Tuesday">{t('programs.form.tuesday')}</SelectItem>
                      <SelectItem value="Wednesday">{t('programs.form.wednesday')}</SelectItem>
                      <SelectItem value="Thursday">{t('programs.form.thursday')}</SelectItem>
                      <SelectItem value="Friday">{t('programs.form.friday')}</SelectItem>
                      <SelectItem value="Saturday">{t('programs.form.saturday')}</SelectItem>
                      <SelectItem value="Sunday">{t('programs.form.sunday')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={`flex justify-end gap-2 pt-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('programs.form.cancel')}
          </Button>
          <Button type="submit">
            {program ? t('programs.form.update') : t('programs.form.create')} {t('programs.form.program')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProgramForm;
