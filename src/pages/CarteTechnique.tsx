import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CarteTechniqueForm from '@/components/carteTechnique/CarteTechniqueForm';
import { getCartesTechniques, createCarteTechnique, updateCarteTechnique, deleteCarteTechnique } from '@/services/api/cartesTechniques';
import { CarteTechnique as CarteTechniqueType } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { exportToCSV } from '@/utils/exportCsv';
import { useLanguage } from '@/contexts/LanguageContext';
import CarteTechniqueDetailsModal from "@/components/carteTechnique/CarteTechniqueDetailsModal";

const CarteTechnique = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarte, setEditingCarte] = useState<CarteTechniqueType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCarte, setSelectedCarte] = useState<CarteTechniqueType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: cartes = [], isLoading } = useQuery({
    queryKey: ['cartes-techniques'],
    queryFn: getCartesTechniques
  });

  const createMutation = useMutation({
    mutationFn: createCarteTechnique,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartes-techniques'] });
      toast({ title: t('carteTechnique.createSuccess'), description: t('carteTechnique.createSuccessDesc') });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CarteTechniqueType> }) => 
      updateCarteTechnique(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartes-techniques'] });
      toast({ title: t('carteTechnique.updateSuccess'), description: t('carteTechnique.updateSuccessDesc') });
      setIsFormOpen(false);
      setEditingCarte(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCarteTechnique,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartes-techniques'] });
      toast({ title: t('carteTechnique.deleteSuccess'), description: t('carteTechnique.deleteSuccessDesc') });
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm(t('carteTechnique.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t('carteTechnique.notAvailable');
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t('carteTechnique.invalidDate');
      return format(date, 'PPpp');
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return t('carteTechnique.invalidDate');
    }
  };

  const roleLabel = (role: string) => {
    if (role === 'director') return t('navigation.teams');
    if (role === 'educator') return t('navigation.members');
    if (role === 'nurse') return t('navigation.children');
    return t('navigation.profile');
  };

  const handleShowDetails = (carte: CarteTechniqueType) => {
    setSelectedCarte(carte);
    setShowDetailsModal(true);
  };

  const filteredCartes = cartes.filter(carte => 
    carte.name_nachat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carte.type_nachat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carte.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canModifyCarteTechniques = () => {
    const allowedRoles = ['animateur_general', 'director', 'educateur', 'chef_groupe'];
    return user && allowedRoles.includes(user.role);
  };

  if (isLoading) {
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
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{t('carteTechnique.title')}</h2>
          {user?.role === 'director' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(cartes, [
                { key: 'id', label: t('carteTechnique.activityName') },
                { key: 'name_nachat', label: t('carteTechnique.activityName') },
                { key: 'type_nachat', label: t('carteTechnique.activityType') },
                { key: 'lieu', label: t('carteTechnique.location') },
                { key: 'time', label: t('carteTechnique.time') },
                { key: 'author_name', label: t('carteTechnique.activityName') }
              ], 'cartes-techniques.csv')}
            >
              {t('carteTechnique.exportCSV')}
            </Button>
          )}
          {canModifyCarteTechniques() && (
            <Button onClick={() => { setEditingCarte(null); setIsFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> {t('carteTechnique.addNew')}
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('carteTechnique.manage')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isFormOpen && (
              <div className="mb-6 p-4 border rounded-lg bg-muted">
                <CarteTechniqueForm
                  initialData={editingCarte}
                  onSubmit={(data) => {
                    if (editingCarte) {
                      updateMutation.mutate({ id: editingCarte.id, data });
                    } else {
                      createMutation.mutate(data);
                    }
                  }}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingCarte(null);
                  }}
                />
              </div>
            )}

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('carteTechnique.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('carteTechnique.activityName')}</TableHead>
                    <TableHead>{t('carteTechnique.activityType')}</TableHead>
                    <TableHead>{t('carteTechnique.location')}</TableHead>
                    <TableHead>{t('carteTechnique.time')}</TableHead>
                    <TableHead>{t('general.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCartes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {searchTerm ? t('carteTechnique.noSearchResults') : t('carteTechnique.noCartes')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCartes.map((carte) => (
                      <TableRow key={carte.id}>
                        <TableCell>{carte.name_nachat}</TableCell>
                        <TableCell>{carte.type_nachat}</TableCell>
                        <TableCell>{carte.lieu}</TableCell>
                        <TableCell>{formatDate(carte.time)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {canModifyCarteTechniques() && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCarte(carte);
                                    setIsFormOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(carte.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowDetails(carte)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t('carteTechnique.showDetails')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CarteTechniqueDetailsModal 
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        carte={selectedCarte}
      />
    </DashboardLayout>
  );
};

export default CarteTechnique;
