// src/pages/Hobbies.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHobbies, createHobby, updateHobby, deleteHobby } from '@/services/api/hobbies';
import { getEducateurEnfants } from '@/services/api/enfants';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Hobby, Enfant } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hobbies = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [formData, setFormData] = useState({
    enfant_name: '',
    hobbies: '',
    interests: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(t('auth.notAuthenticated') || 'Please login to access this page');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, t]);

  const { data: hobbies = [], isLoading: isLoadingHobbies, error: hobbiesError } = useQuery({
    queryKey: ['hobbies'],
    queryFn: getHobbies,
    enabled: !!isAuthenticated,
  });

  const { data: children = [] } = useQuery({
    queryKey: ['educateur-enfants', user?.id],
    queryFn: () => getEducateurEnfants(user?.id),
    enabled: !!isAuthenticated && !!user?.id,
  });

  useEffect(() => {
    if (hobbiesError) {
      toast.error(t('hobbies.loadError') || 'Failed to load hobbies data');
      console.error('Hobbies query error:', hobbiesError);
    }
  }, [hobbiesError, t]);

  const createHobbyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Hobby> }) => 
      createHobby(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hobbies'] });
      toast.success(t('hobbies.createdSuccess') || 'Hobby created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error(t('hobbies.createFailed') || 'Failed to create hobby');
    },
  });

  const updateHobbyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Hobby> }) => 
      updateHobby(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hobbies'] });
      toast.success(t('hobbies.updatedSuccess') || 'Hobby updated successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error(t('hobbies.updateFailed') || 'Failed to update hobby');
    },
  });

  const deleteHobbyMutation = useMutation({
    mutationFn: deleteHobby,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hobbies'] });
      toast.success(t('hobbies.deletedSuccess') || 'Hobby deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error(t('hobbies.deleteFailed') || 'Failed to delete hobby');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   
  const payload: Partial<Hobby> = {
    enfant_name: formData.enfant_name,
    hobbies: formData.hobbies.split(',').map(item => item.trim()),
    interests: formData.interests.split(',').map(item => item.trim())
  };

  if (isEditing && editingHobby && editingHobby.id) {
    updateHobbyMutation.mutate({ id: editingHobby.id, data: payload });
  } else {
    // 🔥 FIX ICI: trouver l'enfant sélectionné pour récupérer son ID
    const selectedChild = children.find(child => child.name === formData.enfant_name);
    if (!selectedChild) {
      toast.error('Selected child not found');
      return;
    }

    createHobbyMutation.mutate({ id: selectedChild.id, data: payload });
  }
};


  const handleEdit = (hobby: Hobby) => {
    if (!hobby.id) {
      toast.error(t('hobbies.cannotEdit') || 'Cannot edit: Missing hobby ID');
      return;
    }

    setIsEditing(true);
    setEditingHobby(hobby);
    setFormData({
      enfant_name: hobby.enfant_name || '',
      hobbies: hobby.hobbies?.join(', ') || '',
      interests: hobby.interests?.join(', ') || ''
    });
  };

  const handleDelete = (id: number) => {
    if (!id) {
      toast.error(t('hobbies.cannotDelete') || 'Cannot delete: Invalid hobby ID');
      return;
    }

    if (window.confirm(t('hobbies.confirmDelete') || 'Are you sure you want to delete this hobby?')) {
      deleteHobbyMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({ enfant_name: '', hobbies: '', interests: '' });
    setIsEditing(false);
    setEditingHobby(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingHobbies) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('hobbies.title') || 'Hobbies & Interests Management'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="enfant_name">
                    {t('hobbies.childName') || 'Child Name'}
                  </label>
                  <select
                    id="enfant_name"
                    value={formData.enfant_name}
                    onChange={(e) => setFormData({ ...formData, enfant_name: e.target.value })}
                    required
                    className="w-full border border-input bg-background rounded-md p-2 text-sm"
                  >
                    <option value="">{t('hobbies.selectChild') || 'Select a child'}</option>
                    {children.map((child: Enfant) => (
                      <option key={child.id} value={child.name}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="hobbies">
                    {t('hobbies.hobbies') || 'Hobbies'}
                  </label>
                  <Input
                    id="hobbies"
                    value={formData.hobbies}
                    onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                    placeholder={t('hobbies.enterHobbies') || 'Enter comma-separated hobbies'}
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="interests">
                    {t('hobbies.interests') || 'Interests'}
                  </label>
                  <Input
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder={t('hobbies.enterInterests') || 'Enter comma-separated interests'}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createHobbyMutation.isPending || updateHobbyMutation.isPending}>
                  {isEditing ? (t('hobbies.update') || 'Update') : (t('hobbies.add') || 'Add')} {t('hobbies.hobbyInterest') || 'Hobby & Interest'}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    {t('general.cancel') || 'Cancel'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('hobbies.allHobbies') || 'All Hobbies & Interests'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hobbies.child') || 'Child'}</TableHead>
                  <TableHead>{t('hobbies.hobbies') || 'Hobbies'}</TableHead>
                  <TableHead>{t('hobbies.interests') || 'Interests'}</TableHead>
                  <TableHead className="text-right">{t('general.actions') || 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hobbies.length > 0 ? (
                  hobbies.map((hobby) => (
                    <TableRow key={hobby.id}>
                      <TableCell>{hobby.enfant_name}</TableCell>
                      <TableCell>
                        {hobby.hobbies?.join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {hobby.interests?.join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(hobby)}
                            disabled={deleteHobbyMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (hobby.id) {
                                handleDelete(hobby.id);
                              } else {
                                toast.error(t('hobbies.cannotDelete') || 'Cannot delete: Missing hobby ID');
                              }
                            }}
                            disabled={deleteHobbyMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {t('hobbies.noHobbies') || 'No hobbies/interests found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Hobbies;
