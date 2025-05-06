import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Team, Member, Enfant, Phase } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/services/api/users';
import { getEnfants } from '@/services/api/enfants';
import { getPhases } from '@/services/api/phases';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamFormProps {
  team?: Team | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TeamForm = ({ team, onSubmit, onCancel }: TeamFormProps) => {
  const { t } = useLanguage();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      educateur_id: team?.educateur_id,
      enfant_id: team?.enfants?.map(child => child.id) || [],
      phase_id: team?.phase_id,
      chef_id: team?.chef_id
    }
  });

  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  });

  const { data: enfants = [], isLoading: isLoadingEnfants } = useQuery({
    queryKey: ['enfants'],
    queryFn: getEnfants
  });

  const { data: phases = [], isLoading: isLoadingPhases } = useQuery({
    queryKey: ['phases'],
    queryFn: getPhases
  });

  const isLoading = isLoadingMembers || isLoadingEnfants || isLoadingPhases;

  const educateurs = members ? members.filter(member => member.role === 'educateur') : [];
  const chefs = members ? members.filter(member => member.role === 'chef_groupe') : [];

  const handleSelectChange = (field: string, value: string) => {
    setValue(field as any, Number(value));
  };

  const handleChildSelect = (childId: number, checked: boolean) => {
    const currentSelected = watch('enfant_id') as number[];
    if (checked) {
      if (currentSelected.length < 10) {
        setValue('enfant_id', [...currentSelected, childId]);
      }
    } else {
      setValue('enfant_id', currentSelected.filter(id => id !== childId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="educateur_id">{t('teams.table.educateur', [])}</Label>
          <Select 
            defaultValue={team?.educateur_id?.toString()}
            onValueChange={(value) => handleSelectChange('educateur_id', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('teams.selectEducateur', [])} />
            </SelectTrigger>
            <SelectContent>
              {educateurs.map((educateur) => (
                <SelectItem key={educateur.id} value={educateur.id.toString()}>
                  {educateur.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.educateur_id && (
            <span className="text-sm text-red-500">{t('teams.educateurRequired', [])}</span>
          )}
          <input
            type="hidden"
            {...register('educateur_id', { required: t('teams.educateurRequired', []) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phase_id">{t('teams.table.phase', [])}</Label>
          <Select 
            defaultValue={team?.phase_id?.toString()}
            onValueChange={(value) => handleSelectChange('phase_id', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('programs.form.selectPhase', [])} />
            </SelectTrigger>
            <SelectContent>
              {phases?.map((phase) => (
                <SelectItem key={phase.id} value={phase.id.toString()}>
                  {phase.name} ({phase.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.phase_id && (
            <span className="text-sm text-red-500">{t('teams.phaseRequired', [])}</span>
          )}
          <input
            type="hidden"
            {...register('phase_id', { required: t('teams.phaseRequired', []) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chef_id">{t('teams.table.teamLeader', [])}</Label>
          <Select 
            defaultValue={team?.chef_id?.toString()}
            onValueChange={(value) => handleSelectChange('chef_id', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('teams.selectTeamLeader', [])} />
            </SelectTrigger>
            <SelectContent>
              {chefs.map((chef) => (
                <SelectItem key={chef.id} value={chef.id.toString()}>
                  {chef.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.chef_id && (
            <span className="text-sm text-red-500">{t('teams.teamLeaderRequired', [])}</span>
          )}
          <input
            type="hidden"
            {...register('chef_id', { required: t('teams.teamLeaderRequired', []) })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>{t('teams.selectChildren', [])}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
          {enfants.map((enfant) => (
            <div key={enfant.id} className="flex items-center space-x-2">
              <Checkbox
                id={`child-${enfant.id}`}
                checked={(watch('enfant_id') as number[])?.includes(enfant.id)}
                onCheckedChange={(checked) => handleChildSelect(enfant.id, checked as boolean)}
              />
              <Label htmlFor={`child-${enfant.id}`}>{enfant.name}</Label>
            </div>
          ))}
        </div>
        {errors.enfant_id && (
          <span className="text-sm text-red-500">{t('teams.childrenRequired', [])}</span>
        )}
        <input
          type="hidden"
          {...register('enfant_id', { 
            required: t('teams.childrenRequired', []),
            validate: (value) => 
              (value as number[]).length > 0 && (value as number[]).length <= 10 || 
              t('teams.selectBetweenOneAndTen', [])
          })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('general.cancel', [])}
        </Button>
        <Button type="submit">
          {team ? t('general.update', []) : t('general.create', [])} {t('teams.team', [])}
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;
