
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";

const schema = z.object({
  name_nachid: z.string().min(2, "Le nom est requis"),
  auteur: z.string().optional(),
  words: z.string().min(2, "Le texte est requis"),
  audio: z.instanceof(File).optional(),
  photo: z.instanceof(File).optional(),
});

export type AnachidFormValues = z.infer<typeof schema>;

type AnachidFormProps = {
  initialValues?: Partial<AnachidFormValues>;
  onSubmit: (values: FormData) => void;
  isLoading?: boolean;
};

export default function AnachidForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: AnachidFormProps) {
  const { t } = useLanguage();
  
  const form = useForm<AnachidFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nachid: initialValues?.name_nachid || "",
      auteur: initialValues?.auteur || "",
      words: initialValues?.words || "",
    },
  });

  // const handleSubmit = (values: AnachidFormValues) => {
  //   const formData = new FormData();
  //   formData.append('name_nachid', values.name_nachid);
  //   if (values.auteur) formData.append('auteur', values.auteur);
  //   formData.append('words', values.words);
  //   if (values.audio) formData.append('audio', values.audio);
  //   if (values.photo) formData.append('photo', values.photo);
    
  //   onSubmit(formData);
  // };
  const handleSubmit = (values: AnachidFormValues) => {
  const formData = new FormData();

  if (values.name_nachid) formData.append('name_nachid', values.name_nachid);
  if (values.auteur) formData.append('auteur', values.auteur);
  if (values.words) formData.append('words', values.words);

  if (values.audio instanceof File) {
    formData.append('audio', values.audio);
  }
  
  if (values.photo instanceof File) {
    formData.append('photo', values.photo);
  }
  
  onSubmit(formData);
};


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <FormField
          name="name_nachid"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('anachids.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('anachids.name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="auteur"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('anachids.author')}</FormLabel>
              <FormControl>
                <Input placeholder={t('anachids.author')} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="words"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('anachids.words')}</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder={t('anachids.words')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="audio"
          control={form.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Audio (MP3, WAV, OGG)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".mp3,.wav,.ogg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="photo"
          control={form.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Photo (JPEG, PNG, GIF)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('general.loading') : t('general.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
