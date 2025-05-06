
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Stethoscope, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getMaladies, createMaladie, updateMaladie, deleteMaladie } from '@/services/api/maladies';
import { getEnfants } from '@/services/api/enfants';
import { Maladie, Enfant } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 4;

const MaladiesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMaladie, setCurrentMaladie] = useState<Maladie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    enfant_id: 0,
    name_maladie: '',
    description_maladie: '',
    medicament_name: '',
    posologie: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const { data: maladies, isLoading: maladiesLoading } = useQuery({
    queryKey: ['maladies'],
    queryFn: getMaladies,
  });

  const { data: enfants, isLoading: enfantsLoading } = useQuery({
    queryKey: ['enfants'],
    queryFn: getEnfants,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Maladie, "id" | "created_at" | "updated_at">) => createMaladie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maladies'] });
      toast({
        title: "Success",
        description: "Medical condition created successfully",
      });
      setIsCreateDialogOpen(false);
      resetFormData();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create medical condition",
        variant: "destructive",
      });
      console.error("Failed to create maladie:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Maladie> }) => 
      updateMaladie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maladies'] });
      toast({
        title: "Success",
        description: "Medical condition updated successfully",
      });
      setIsEditDialogOpen(false);
      setCurrentMaladie(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update medical condition",
        variant: "destructive",
      });
      console.error("Failed to update maladie:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaladie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maladies'] });
      toast({
        title: "Success",
        description: "Medical condition deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete medical condition",
        variant: "destructive",
      });
      console.error("Failed to delete maladie:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'enfant_id') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.enfant_id) {
      toast({
        title: "Error",
        description: "Please select a child",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({
      enfant_id: formData.enfant_id,
      name_maladie: formData.name_maladie,
      description_maladie: formData.description_maladie,
      medicament_name: formData.medicament_name || null,
      posologie: formData.posologie || null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMaladie) return;
    updateMutation.mutate({
      id: currentMaladie.id,
      data: {
        enfant_id: formData.enfant_id,
        name_maladie: formData.name_maladie,
        description_maladie: formData.description_maladie,
        medicament_name: formData.medicament_name || null,
        posologie: formData.posologie || null,
      }
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('maladies.confirmDelete', ['Are you sure you want to delete this medical condition?']))) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (maladie: Maladie) => {
    setCurrentMaladie(maladie);
    setFormData({
      enfant_id: maladie.enfant_id,
      name_maladie: maladie.name_maladie,
      description_maladie: maladie.description_maladie,
      medicament_name: maladie.medicament_name || '',
      posologie: maladie.posologie || '',
    });
    setIsEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      enfant_id: 0,
      name_maladie: '',
      description_maladie: '',
      medicament_name: '',
      posologie: '',
    });
  };

  const openCreateDialog = () => {
    resetFormData();
    setIsCreateDialogOpen(true);
  };

  const filteredMaladies = maladies?.filter(maladie => 
    maladie.name_maladie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maladie.description_maladie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (maladie.enfant?.name && maladie.enfant.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil((filteredMaladies?.length || 0) / ITEMS_PER_PAGE);
  const paginatedMaladies = filteredMaladies?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  };

  if (maladiesLoading || enfantsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">{t('general.loading', ['Loading data...'])}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">{t('maladies.title', ['Medical Dashboard'])}</h1>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('maladies.addMedical', ['Add Medical Condition'])}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('maladies.totalRecords', ['Total Medical Records'])}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{maladies?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('maladies.medicalRecords', ['Medical Records'])}</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('maladies.searchMedical', ['Search medical records...'])}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('maladies.childName', ['Child Name'])}</TableHead>
                    <TableHead>{t('maladies.condition', ['Condition'])}</TableHead>
                    <TableHead>{t('maladies.description', ['Description'])}</TableHead>
                    <TableHead>{t('maladies.medication', ['Medication'])}</TableHead>
                    <TableHead>{t('maladies.dosage', ['Dosage'])}</TableHead>
                    <TableHead>{t('maladies.actions', ['Actions'])}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMaladies && paginatedMaladies.length > 0 ? (
                    paginatedMaladies.map((maladie) => (
                      <TableRow key={maladie.id}>
                        <TableCell className="font-medium">
                          {maladie.enfant?.name || t('maladies.childId', [`Child ID: ${maladie.enfant_id}`])}
                        </TableCell>
                        <TableCell>{maladie.name_maladie}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {maladie.description_maladie}
                        </TableCell>
                        <TableCell>{maladie.medicament_name || t('maladies.none', ['None'])}</TableCell>
                        <TableCell>{maladie.posologie || t('maladies.none', ['None'])}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(maladie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(maladie.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {t('maladies.noneFound', ['No medical records found'])}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePrevious}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNext}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <div className="mt-4 text-sm text-muted-foreground text-center">
              {t('maladies.showing', [`${paginatedMaladies?.length || 0}`, `${filteredMaladies?.length || 0}`])}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('maladies.addMedical', ['Add New Medical Condition'])}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="enfant_id">{t('maladies.child', ['Child'])}</Label>
                <select
                  id="enfant_id"
                  name="enfant_id"
                  value={formData.enfant_id}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">{t('maladies.selectChild', ['Select a child'])}</option>
                  {enfants?.map((enfant: Enfant) => (
                    <option key={enfant.id} value={enfant.id}>
                      {enfant.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="name_maladie">{t('maladies.medicalCondition', ['Medical Condition'])}</Label>
                <Input 
                  id="name_maladie" 
                  name="name_maladie"
                  value={formData.name_maladie}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description_maladie">{t('maladies.description', ['Description'])}</Label>
                <textarea 
                  id="description_maladie"
                  name="description_maladie"
                  value={formData.description_maladie}
                  onChange={handleInputChange}
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="medicament_name">{t('maladies.medication', ['Medication'])}</Label>
                <Input 
                  id="medicament_name" 
                  name="medicament_name"
                  value={formData.medicament_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="posologie">{t('maladies.dosage', ['Dosage'])}</Label>
                <Input 
                  id="posologie" 
                  name="posologie"
                  value={formData.posologie}
                  onChange={handleInputChange}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('general.cancel', ['Cancel'])}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? t('general.saving', ['Saving...']) : t('general.save', ['Save'])}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('maladies.editMedical', ['Edit Medical Condition'])}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit_enfant_id">{t('maladies.child', ['Child'])}</Label>
                <select
                  id="edit_enfant_id"
                  name="enfant_id"
                  value={formData.enfant_id}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">{t('maladies.selectChild', ['Select a child'])}</option>
                  {enfants?.map((enfant: Enfant) => (
                    <option key={enfant.id} value={enfant.id}>
                      {enfant.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="edit_name_maladie">{t('maladies.medicalCondition', ['Medical Condition'])}</Label>
                <Input 
                  id="edit_name_maladie" 
                  name="name_maladie"
                  value={formData.name_maladie}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_description_maladie">{t('maladies.description', ['Description'])}</Label>
                <textarea 
                  id="edit_description_maladie"
                  name="description_maladie"
                  value={formData.description_maladie}
                  onChange={handleInputChange}
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_medicament_name">{t('maladies.medication', ['Medication'])}</Label>
                <Input 
                  id="edit_medicament_name" 
                  name="medicament_name"
                  value={formData.medicament_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="edit_posologie">{t('maladies.dosage', ['Dosage'])}</Label>
                <Input 
                  id="edit_posologie" 
                  name="posologie"
                  value={formData.posologie}
                  onChange={handleInputChange}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('general.cancel', ['Cancel'])}
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? t('general.updating', ['Updating...']) : t('general.update', ['Update'])}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MaladiesPage;
