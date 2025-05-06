
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnachids, deleteAnachid, createAnachid, updateAnachid } from '@/services/api/anachids';
import DashboardLayout from '@/components/DashboardLayout';
import { Music, Edit, Trash2, Plus, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AnachidForm, { AnachidFormValues } from '@/components/anachids/AnachidForm';

const Anachids = () => {
  const { data: anachids, isLoading } = useQuery({
    queryKey: ['anachids'],
    queryFn: getAnachids
  });

  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const queryClient = useQueryClient();

  const [selectedAnachid, setSelectedAnachid] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Add a function to check if user has permission to modify anachids
  const canModifyAnachids = () => {
    const allowedRoles = ['animateur_general', 'director', 'educateur', 'chef_groupe'];
    return user && allowedRoles.includes(user.role);
  };

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createAnachid(formData),
    onSuccess: () => {
      toast.success(t('anachids.createSuccess'));
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ['anachids'] });
    },
    onError: () => {
      toast.error(t('anachids.createError'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; formData: FormData }) =>
      updateAnachid(data.id, data.formData),
    onSuccess: () => {
      toast.success(t('anachids.updateSuccess'));
      setShowEditDialog(false);
      setSelectedAnachid(null);
      queryClient.invalidateQueries({ queryKey: ['anachids'] });
    },
    onError: () => {
      toast.error(t('anachids.updateError'));
    },
  });

  const removeAnachidMutation = useMutation({
    mutationFn: (id: number) => deleteAnachid(id),
    onSuccess: () => {
      toast.success(t('anachids.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['anachids'] });
    },
    onError: () => {
      toast.error(t('anachids.deleteError'));
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="loading">Loading...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('anachids.title')}</h1>
          {canModifyAnachids() && (
            <>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="ml-auto bg-primary text-white hover:bg-primary/80 gap-2"
                    size="sm"
                    aria-label={t('anachids.add')}
                    onClick={() => setShowAddDialog(true)}
                  >
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      {t('anachids.add')}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('anachids.addNew')}</DialogTitle>
                  </DialogHeader>
                  <AnachidForm
                    onSubmit={createMutation.mutate}
                    isLoading={createMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anachids?.map((anachid) => (
            <Card key={anachid.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <div className={`absolute top-2 ${direction === 'rtl' ? 'left-2' : 'right-2'} flex gap-2 z-10`}>
                <Dialog open={showDialog && selectedAnachid?.id === anachid.id} onOpenChange={(open) => {
                  setShowDialog(open);
                  if (!open) setSelectedAnachid(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={t('anachids.view')}
                      onClick={() => {
                        setSelectedAnachid(anachid);
                        setShowDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedAnachid?.name_nachid}</DialogTitle>
                      <DialogDescription>
                        {t('anachids.by')} {selectedAnachid?.auteur || t('anachids.unknown')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-2 whitespace-pre-line text-base text-gray-900 dark:text-gray-100">
                      {selectedAnachid?.words}
                    </div>
                  </DialogContent>
                </Dialog>

                {canModifyAnachids() && (
                  <>
                    <Dialog open={showEditDialog && selectedAnachid?.id === anachid.id} onOpenChange={(open) => {
                      setShowEditDialog(open);
                      if (!open) setSelectedAnachid(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t('anachids.edit')}
                          onClick={() => {
                            setSelectedAnachid(anachid);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('anachids.editAnachid')}</DialogTitle>
                          <DialogDescription>
                            {t('anachids.formDescription')}
                          </DialogDescription>
                        </DialogHeader>
                        <AnachidForm
                          initialValues={selectedAnachid}
                          onSubmit={(formData) => updateMutation.mutate({ id: anachid.id, formData })}
                          isLoading={updateMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="icon"
                      variant="destructive"
                      aria-label={t('anachids.delete')}
                      onClick={() => {
                        if (window.confirm(t('anachids.confirmDelete'))) {
                          removeAnachidMutation.mutate(anachid.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="aspect-video relative">
                <img
                  src={`http://localhost:8000/storage/${anachid.photo}`}
                  alt={anachid.name_nachid}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{anachid.name_nachid}</CardTitle>
                <CardDescription>{t('anachids.by')} {anachid.auteur}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {anachid.words}
                </p>
                {anachid.audio && (
                  <audio controls className="w-full mt-4">
                    <source src={`http://localhost:8000/storage/${anachid.audio}`} type="audio/mpeg" />
                    {t('anachids.noSupport')}
                  </audio>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Anachids;
