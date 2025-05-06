
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Enfant } from '@/types';

interface EnfantFormProps {
  enfant: Enfant | null;
  onSubmit: (data: Partial<Enfant>) => void;
  onCancel: () => void;
}

const EnfantForm = ({ enfant, onSubmit, onCancel }: EnfantFormProps) => {
  const form = useForm({
    defaultValues: {
      name: enfant?.name || '',
      date_naissance: enfant?.date_naissance ? enfant.date_naissance.substring(0, 10) : '',
      lieu_naissance: enfant?.lieu_naissance || '',
      sexe: enfant?.sexe || 'M',
      niveau_scolaire: enfant?.niveau_scolaire || '',
      nombre_freres: enfant?.nombre_freres || 0,
      nombre_soeurs: enfant?.nombre_soeurs || 0,
      rang_familial: enfant?.rang_familial || '',
      nom_pere: enfant?.nom_pere || '',
      nom_mere: enfant?.nom_mere || '',
      contact_parent: enfant?.contact_parent || '',
      profession_parent: enfant?.profession_parent || '',
      date_examen_medical: enfant?.date_examen_medical ? enfant.date_examen_medical.substring(0, 10) : '',
      resultat_examen: enfant?.resultat_examen || '',
      region: enfant?.region || '',
      participation_count: enfant?.participation_count || 0,
      floss: enfant?.floss || 0
    }
  });

  const regions = [
    'Tanger-Tétouan-Al Hoceïma',
    'Oriental',
    'Fès-Meknès',
    'Rabat-Salé-Kénitra',
    'Béni Mellal-Khénifra',
    'Casablanca-Settat',
    'Marrakech-Safi',
    'Drâa-Tafilalet',
    'Souss-Massa',
    'Guelmim-Oued Noun',
    'Laâyoune-Sakia El Hamra',
    'Dakhla-Oued Ed-Dahab'
  ];

  const familyRanks = [
    'Unique',
    'Aîné',
    'Cadet',
    'Benjamin'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Child's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sexe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
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
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lieu_naissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthplace</FormLabel>
                <FormControl>
                  <Input placeholder="City of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="niveau_scolaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Level</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3rd Grade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select region</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floss</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Floss value" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombre_freres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Brothers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombre_soeurs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Sisters</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rang_familial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Rank</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select family rank</option>
                    {familyRanks.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nom_pere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Father's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nom_mere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mother's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_parent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profession_parent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Parent's job" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_examen_medical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Exam Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resultat_examen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Exam Result</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Healthy, Asthma" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {enfant && (
            <FormField
              control={form.control}
              name="participation_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participation Count</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{enfant ? 'Update' : 'Create'} Child Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default EnfantForm;
